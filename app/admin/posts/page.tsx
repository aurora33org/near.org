import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PostDeleteButton } from "@/components/admin/PostDeleteButton";

const PAGE_SIZE = 20;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  const userRole = (session?.user as any)?.role;
  const userId = session?.user?.id;

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));
  const skip = (page - 1) * PAGE_SIZE;

  const where =
    userRole === "ADMIN" ? {} : { authorId: userId as string };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { author: true },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Blog Posts</h1>
        {userRole !== "VIEWER" && (
          <Button asChild>
            <Link href="/admin/posts/new">+ New Post</Link>
          </Button>
        )}
      </div>

      <Card>
        {posts.length === 0 ? (
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">No posts yet.</p>
            {userRole !== "VIEWER" && (
              <Button asChild variant="link" className="mt-2">
                <Link href="/admin/posts/new">Create the first one</Link>
              </Button>
            )}
          </CardContent>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-6 py-3 text-left font-medium text-sm">Title</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Author</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Status</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Created</th>
                    <th className="px-6 py-3 text-right font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-muted/20 transition">
                      <td className="px-6 py-4">
                        <p className="font-medium">{post.title}</p>
                        <p className="text-xs text-muted-foreground">{post.slug}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">{post.author.name}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            post.status === "PUBLISHED"
                              ? "default"
                              : post.status === "DRAFT"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {post.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {post.status === "PUBLISHED" && (
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/blog/${post.slug}`} target="_blank">View</Link>
                            </Button>
                          )}
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>
                          </Button>
                          {userRole !== "VIEWER" && (
                            <PostDeleteButton
                              postId={post.id}
                              postTitle={post.title}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages} ({total} posts)
                </p>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/posts?page=${page - 1}`}>← Previous</Link>
                    </Button>
                  )}
                  {page < totalPages && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/posts?page=${page + 1}`}>Next →</Link>
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
