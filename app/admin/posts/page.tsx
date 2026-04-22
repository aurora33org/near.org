import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PostsBulkTable } from "./PostsBulkTable";
import { PostsPageTour } from "@/components/admin/onboarding/PostsPageTour";

const PAGE_SIZE = 20;
const VALID_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
type PostStatus = (typeof VALID_STATUSES)[number];

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}) {
  const session = await auth();
  const userRole = (session?.user as any)?.role;
  const userId = session?.user?.id;

  const { page: pageParam, q, status: statusParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));
  const skip = (page - 1) * PAGE_SIZE;

  const baseWhere: Prisma.PostWhereInput =
    userRole === "VIEWER" ? { authorId: userId as string } : {};

  const filters: Prisma.PostWhereInput = {};
  if (q) {
    filters.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
      { seoTitle: { contains: q, mode: "insensitive" } },
      { author: { name: { contains: q, mode: "insensitive" } } },
    ];
  }
  if (statusParam && (VALID_STATUSES as readonly string[]).includes(statusParam))
    filters.status = statusParam as PostStatus;
  const where = { ...baseWhere, ...filters };

  const hasFilters = !!(q || statusParam);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { author: true, lastEditedBy: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function buildPageUrl(p: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (statusParam) params.set("status", statusParam);
    params.set("page", String(p));
    return `/admin/posts?${params.toString()}`;
  }

  return (
    <div className="space-y-8">
      <PostsPageTour />

      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Blog Posts</h1>
        {userRole !== "VIEWER" && (
          <Button asChild data-posts-tour-id="new-post">
            <Link href="/admin/posts/new">+ New Post</Link>
          </Button>
        )}
      </div>

      {/* Filter bar */}
      <form method="GET" data-posts-tour-id="filter-bar" className="flex items-center gap-3 flex-wrap">
        <Input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search posts…"
          className="w-64"
        />
        <select
          name="status"
          defaultValue={statusParam ?? ""}
          className="border border-border rounded-[var(--radius)] px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <Button type="submit" variant="outline" size="sm">Filter</Button>
        {hasFilters && (
          <Link href="/admin/posts" className="text-sm text-muted-foreground hover:text-foreground transition">
            Clear
          </Link>
        )}
      </form>

      <Card>
        {posts.length === 0 ? (
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">
              {hasFilters ? "No posts match your search." : "No posts yet."}
            </p>
            {!hasFilters && userRole !== "VIEWER" && (
              <Button asChild variant="link" className="mt-2">
                <Link href="/admin/posts/new">Create the first one</Link>
              </Button>
            )}
          </CardContent>
        ) : (
          <>
            <PostsBulkTable
              posts={posts.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                status: p.status,
                publishedAt: p.publishedAt?.toISOString() ?? null,
                createdAt: p.createdAt.toISOString(),
                author: { name: p.author.name },
                lastEditedBy: p.lastEditedBy ? { name: p.lastEditedBy.name } : null,
                lockedByEmail: p.lockedByEmail ?? null,
              }))}
              userRole={userRole}
            />

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages} ({total} posts)
                </p>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={buildPageUrl(page - 1)}>← Previous</Link>
                    </Button>
                  )}
                  {page < totalPages && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={buildPageUrl(page + 1)}>Next →</Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
