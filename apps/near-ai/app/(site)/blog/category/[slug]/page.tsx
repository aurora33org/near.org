import Link from "next/link";
import Image from "next/image";
import { prisma } from "@near/cms-core/lib/prisma";
import { notFound } from "next/navigation";
import { extractExcerpt } from "@near/cms-core/lib/excerpt";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return { title: `${category.name} — NEAR AI Blog`, description: `Posts in ${category.name} on NEAR AI.` };
}

const PAGE_SIZE = 12;

export default async function CategoryPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));
  const skip = (page - 1) * PAGE_SIZE;
  const now = new Date();

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const where = { status: "PUBLISHED" as const, publishedAt: { lte: now }, categories: { some: { slug } } };
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where, orderBy: { publishedAt: "desc" }, take: PAGE_SIZE, skip,
      select: { id: true, slug: true, title: true, coverImage: true, publishedAt: true, excerpt: true, content: true, author: { select: { name: true } } },
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="bg-white text-black">
      <section className="bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 py-20 px-6 text-center">
        <p className="text-purple-300 text-xs tracking-widest uppercase font-mono mb-3">Category</p>
        <h1 className="text-4xl font-bold text-white mb-3">{category.name}</h1>
        <p className="text-purple-300 text-sm">{total} post{total !== 1 ? "s" : ""}</p>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 py-24">No posts in this category yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const excerpt = post.excerpt || extractExcerpt(post.content);
                return (
                  <article key={post.id} className="group flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-shadow">
                    <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                      {post.coverImage ? (
                        <div className="relative aspect-[16/9] w-full bg-purple-50">
                          <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
                        </div>
                      ) : (
                        <div className="aspect-[16/9] w-full bg-gradient-to-br from-violet-50 to-fuchsia-50 flex items-center justify-center">
                          <span className="text-purple-200 text-4xl">✦</span>
                        </div>
                      )}
                    </Link>
                    <div className="flex flex-col flex-1 p-5">
                      <p className="text-xs text-gray-400 mb-2">
                        {new Date(post.publishedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {post.author.name}
                      </p>
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-base font-bold leading-snug text-gray-900 group-hover:text-purple-700 transition-colors mb-2 line-clamp-2">{post.title}</h2>
                      </Link>
                      {excerpt && <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">{excerpt}</p>}
                      <Link href={`/blog/${post.slug}`} className="mt-4 text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors">Read more →</Link>
                    </div>
                  </article>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-16">
                {page > 1 && <Link href={`/blog/category/${slug}?page=${page - 1}`} className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition">← Previous</Link>}
                <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
                {page < totalPages && <Link href={`/blog/category/${slug}?page=${page + 1}`} className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Next →</Link>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
