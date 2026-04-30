import Link from "next/link";
import Image from "next/image";
import { prisma } from "@near/cms-core/lib/prisma";
import { notFound } from "next/navigation";
import { extractExcerpt } from "@near/cms-core/lib/excerpt";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${tag} — NEAR Blog` };
}

const PAGE_SIZE = 12;

export default async function TagPage({ params, searchParams }: { params: Promise<{ tag: string }>; searchParams: Promise<{ page?: string }> }) {
  const { tag: tagSlug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));
  const now = new Date();
  const tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
  if (!tag) notFound();

  const where = { status: "PUBLISHED" as const, publishedAt: { lte: now }, tags: { some: { slug: tagSlug } } };
  const [posts, total] = await Promise.all([
    prisma.post.findMany({ where, orderBy: { publishedAt: "desc" }, take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE,
      select: { id: true, slug: true, title: true, coverImage: true, publishedAt: true, excerpt: true, content: true, author: { select: { name: true } } } }),
    prisma.post.count({ where }),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="bg-white text-black">
      <section className="bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 py-20 px-6 text-center">
        <p className="text-emerald-300 text-xs tracking-widest uppercase font-mono mb-3">Tag</p>
        <h1 className="text-4xl font-bold text-white mb-3">#{tag.name}</h1>
        <p className="text-emerald-300 text-sm">{total} post{total !== 1 ? "s" : ""}</p>
      </section>
      <div className="max-w-6xl mx-auto px-6 py-16">
        {posts.length === 0 ? <p className="text-center text-gray-400 py-24">No posts with this tag yet.</p> : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const excerpt = post.excerpt || extractExcerpt(post.content);
                return (
                  <article key={post.id} className="group flex flex-col rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                    <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                      {post.coverImage ? (
                        <div className="relative aspect-[16/9] bg-emerald-50"><Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="33vw" /></div>
                      ) : (
                        <div className="aspect-[16/9] bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center"><span className="text-emerald-200 text-4xl">✦</span></div>
                      )}
                    </Link>
                    <div className="flex flex-col flex-1 p-5">
                      <p className="text-xs text-gray-400 mb-2">{new Date(post.publishedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {post.author.name}</p>
                      <Link href={`/blog/${post.slug}`}><h2 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-2 line-clamp-2">{post.title}</h2></Link>
                      {excerpt && <p className="text-gray-500 text-sm line-clamp-2 flex-1">{excerpt}</p>}
                      <Link href={`/blog/${post.slug}`} className="mt-4 text-sm text-emerald-600 hover:text-emerald-800 font-medium">Read more →</Link>
                    </div>
                  </article>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-16">
                {page > 1 && <Link href={`/blog/tag/${tagSlug}?page=${page - 1}`} className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">← Previous</Link>}
                <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
                {page < totalPages && <Link href={`/blog/tag/${tagSlug}?page=${page + 1}`} className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Next →</Link>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
