import Link from "next/link";
import Image from "next/image";
import { prisma } from "@near/cms-core/lib/prisma";
import { extractExcerpt } from "@near/cms-core/lib/excerpt";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — NEAR",
  description: "News, updates, and insights from the NEAR ecosystem.",
  openGraph: { type: "website", url: "https://near.com/blog", siteName: "NEAR", title: "Blog — NEAR" },
};

const PAGE_SIZE = 12;

export default async function BlogIndex({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; category?: string }> }) {
  const { page: pageParam, q, category } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));
  const skip = (page - 1) * PAGE_SIZE;
  const now = new Date();

  const publishedWhere = {
    status: "PUBLISHED" as const,
    publishedAt: { lte: now },
    ...(q && { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { excerpt: { contains: q, mode: "insensitive" as const } }] }),
    ...(category && { categories: { some: { slug: category } } }),
  };

  const [posts, total, categories] = await Promise.all([
    prisma.post.findMany({ where: publishedWhere, orderBy: { publishedAt: "desc" }, take: PAGE_SIZE, skip,
      select: { id: true, slug: true, title: true, coverImage: true, publishedAt: true, excerpt: true, content: true, categories: { select: { name: true, slug: true } } } }),
    prisma.post.count({ where: publishedWhere }),
    prisma.category.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="bg-white text-black">
      <section className="bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-emerald-300 text-xs tracking-widest uppercase font-mono mb-4">NEAR Blog</p>
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">Building the open web</h1>
          <p className="text-emerald-200 text-lg max-w-xl mx-auto">News, ecosystem updates, and insights from NEAR.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <form method="GET" className="mb-8">
          <input type="text" name="q" placeholder="Search posts..." defaultValue={q ?? ""}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
        </form>

        {categories.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            <Link href="/blog" className={`px-4 py-2 rounded-full text-sm font-medium transition ${!category ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>All</Link>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/blog?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${category === cat.slug ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-24 text-gray-400"><p className="text-5xl mb-4">✦</p><p className="text-lg">No posts yet.</p></div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const excerpt = post.excerpt || extractExcerpt(post.content);
                const date = new Date(post.publishedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                return (
                  <article key={post.id} className="group flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-shadow">
                    <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                      {post.coverImage ? (
                        <div className="relative aspect-[16/9] w-full bg-emerald-50">
                          <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
                        </div>
                      ) : (
                        <div className="aspect-[16/9] w-full bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                          <span className="text-emerald-200 text-4xl">✦</span>
                        </div>
                      )}
                    </Link>
                    <div className="flex flex-col flex-1 p-5">
                      {post.categories[0] && <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-2">{post.categories[0].name}</span>}
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-base font-bold leading-snug text-gray-900 group-hover:text-emerald-700 transition-colors mb-2 line-clamp-2">{post.title}</h2>
                      </Link>
                      {excerpt && <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">{excerpt}</p>}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-400">{date}</span>
                        <Link href={`/blog/${post.slug}`} className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors">Read →</Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-16">
                {page > 1 && <Link href={`/blog?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}${category ? `&category=${category}` : ""}`} className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition">← Previous</Link>}
                <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
                {page < totalPages && <Link href={`/blog?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}${category ? `&category=${category}` : ""}`} className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Next →</Link>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
