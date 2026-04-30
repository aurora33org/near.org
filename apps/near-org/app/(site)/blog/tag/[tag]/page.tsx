import Link from "next/link";
import Image from "next/image";
import { prisma } from "@near/cms-core/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

const PAGE_SIZE = 12;

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const tagRecord = await prisma.tag.findUnique({ where: { slug: tag } });

  if (!tagRecord) return {};

  return {
    title: `Posts tagged: ${tagRecord.name}`,
    description: `Read all posts tagged with "${tagRecord.name}"`,
  };
}

export async function generateStaticParams() {
  try {
    const tags = await prisma.tag.findMany({ select: { slug: true } });
    return tags.map((tag) => ({ tag: tag.slug }));
  } catch {
    return [];
  }
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { tag } = await params;
  const { page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const skip = (pageNum - 1) * PAGE_SIZE;

  const now = new Date();
  const publishedWhere = {
    status: "PUBLISHED" as const,
    publishedAt: { lte: now },
    tags: { some: { slug: tag } },
  };

  const tagRecord = await prisma.tag.findUnique({ where: { slug: tag } });

  if (!tagRecord) {
    notFound();
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: publishedWhere,
      orderBy: { publishedAt: "desc" },
      take: PAGE_SIZE,
      skip,
      select: {
        id: true,
        slug: true,
        title: true,
        coverImage: true,
        publishedAt: true,
        excerpt: true,
        author: { select: { name: true } },
      },
    }),
    prisma.post.count({ where: publishedWhere }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <Link href="/blog" className="text-sm opacity-70 hover:opacity-100 mb-4 inline-block transition">
            ← Back to blog
          </Link>
          <h1 className="text-4xl font-bold mb-2">Posts tagged: {tagRecord.name}</h1>
          <p className="text-gray-600">{total} post{total !== 1 ? "s" : ""} found</p>
        </div>
      </div>

      {/* POSTS GRID */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    {post.coverImage ? (
                      <div className="relative aspect-video w-full bg-gray-100">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-300 text-4xl">✦</span>
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-col flex-1 p-5">
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(post.publishedAt!).toLocaleDateString()} · {post.author.name}
                    </p>
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-lg font-bold leading-snug hover:text-gray-600 mb-2">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 flex-1">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-4 text-sm text-blue-600 hover:underline font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {pageNum > 1 && (
                  <Link
                    href={`/blog/tag/${tag}?page=${pageNum - 1}`}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/blog/tag/${tag}?page=${p}`}
                    className={`px-4 py-2 rounded transition ${
                      p === pageNum
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {pageNum < totalPages && (
                  <Link
                    href={`/blog/tag/${tag}?page=${pageNum + 1}`}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600 py-12">No posts found with this tag.</p>
        )}
      </div>
    </div>
  );
}
