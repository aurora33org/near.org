import Link from "next/link";
import Image from "next/image";
import { prisma } from "@near/cms-core/lib/prisma";
import { extractExcerpt } from "@near/cms-core/lib/excerpt";
import { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — NEAR AI",
  description: "Insights on AI, private compute, and the future of the open web.",
  openGraph: {
    type: "website",
    url: "https://near.ai/blog",
    siteName: "NEAR AI",
    title: "Blog — NEAR AI",
    description: "Insights on AI, private compute, and the future of the open web.",
  },
};

const PAGE_SIZE = 12;

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; category?: string }>;
}) {
  const { page: pageParam, q, category } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));
  const skip = (page - 1) * PAGE_SIZE;
  const now = new Date();

  const publishedWhere = {
    status: "PUBLISHED" as const,
    publishedAt: { lte: now },
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { excerpt: { contains: q, mode: "insensitive" as const } },
      ],
    }),
    ...(category && { categories: { some: { slug: category } } }),
  };

  const [posts, total, categories] = await Promise.all([
    prisma.post.findMany({
      where: publishedWhere,
      orderBy: { publishedAt: "desc" },
      take: PAGE_SIZE,
      skip,
      select: { id: true, slug: true, title: true, coverImage: true, publishedAt: true, excerpt: true, content: true, categories: { select: { name: true, slug: true } } },
    }),
    prisma.post.count({ where: publishedWhere }),
    prisma.category.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      {/* HERO */}
      <section className="relative bg-[#101010] min-h-[420px] flex flex-col">
        <div className="relative z-10 flex flex-col flex-1 mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">
          <SiteHeader />
          <div className="flex flex-col flex-1 justify-end pb-16 lg:pb-24">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-white/50 mb-4">NEAR AI BLOG</span>
            <h1
              className="text-white font-medium leading-[1.05] tracking-tight"
              style={{ fontSize: "var(--font-size-h1)" }}
            >
              The future of AI<br className="hidden sm:block" /> is open
            </h1>
            <p
              className="mt-4 text-white/60 font-mono max-w-[520px] leading-relaxed"
              style={{ fontSize: "var(--font-size-body)" }}
            >
              Insights on private AI, confidential compute, and building the open web.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20 py-16">

        {/* SEARCH */}
        <form method="GET" className="mb-8">
          <input
            type="text"
            name="q"
            placeholder="Search posts..."
            defaultValue={q ?? ""}
            className="w-full px-4 py-3 border border-[#CAC8C8] rounded-xl bg-white/80 text-[#101010] placeholder-[#5A5A5A]/60 focus:outline-none focus:border-[#101010] transition-colors"
          />
        </form>

        {/* CATEGORY PILLS */}
        {categories.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-full text-sm font-mono transition ${
                !category ? "bg-[#101010] text-white" : "bg-[#ECECEC] text-[#5A5A5A] hover:bg-[#CAC8C8]"
              }`}
            >
              All
            </Link>
            {categories.map((cat: { id: string; name: string; slug: string }) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-mono transition ${
                  category === cat.slug ? "bg-[#101010] text-white" : "bg-[#ECECEC] text-[#5A5A5A] hover:bg-[#CAC8C8]"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {(q || category) && (
          <p className="text-sm font-mono text-[#5A5A5A] mb-6">
            {total} result{total !== 1 ? "s" : ""}{q && ` for "${q}"`}
          </p>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-24 text-[#CAC8C8]">
            <p className="text-5xl mb-4">✦</p>
            <p className="font-mono text-[#5A5A5A]" style={{ fontSize: "var(--font-size-body)" }}>No posts yet. Check back soon.</p>
          </div>
        ) : (
          <>
            {/* FEATURED — Editorial 30/70 */}
            {page === 1 && !q && !category && posts[0] && (() => {
              const featured = posts[0];
              const excerpt = featured.excerpt || extractExcerpt(featured.content);
              return (
                <Link href={`/blog/${featured.slug}`} className="group block mb-12">
                  <article className="flex flex-col sm:flex-row rounded-[2rem] overflow-hidden border border-[#CAC8C8] hover:shadow-xl transition-shadow duration-300 min-h-[480px]">

                    {/* IMAGE — 60% */}
                    <div className="relative w-full sm:w-[60%] shrink-0 aspect-[16/9] sm:aspect-auto bg-[#CAC8C8]">
                      {featured.coverImage ? (
                        <Image
                          src={featured.coverImage}
                          alt={featured.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, 30vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[#e4e4e4] text-6xl">✦</span>
                        </div>
                      )}
                    </div>

                    {/* CONTENT — 70%, separated by a thin line */}
                    <div className="flex flex-col flex-1 bg-[#ECECEC] border-t sm:border-t-0 sm:border-l border-[#CAC8C8] px-8 lg:px-12 py-8 lg:py-10">

                      {/* Top label row */}
                      <div className="flex items-center gap-3 mb-6">
                        <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#5A5A5A]">Featured</span>
                        <span className="font-mono text-[0.65rem] text-[#CAC8C8]">·</span>
                        <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#CAC8C8]">01</span>
                        {featured.categories[0] && (
                          <>
                            <span className="font-mono text-[0.65rem] text-[#CAC8C8]">·</span>
                            <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#CAC8C8]">{featured.categories[0].name}</span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h2
                        className="font-medium leading-[1.1] tracking-tight text-[#101010] group-hover:text-[#525252] transition-colors mb-5"
                        style={{ fontSize: "var(--font-size-h2)" }}
                      >{featured.title}</h2>

                      {/* Excerpt */}
                      {excerpt && (
                        <p className="font-mono text-[#5A5A5A] leading-relaxed line-clamp-5 flex-1 mb-8" style={{ fontSize: "var(--font-size-body)" }}>
                          {excerpt}
                        </p>
                      )}

                      {/* Bottom meta row */}
                      <div className="flex items-center justify-between pt-6 border-t border-[#CAC8C8]">
                        <span className="font-mono text-[0.75rem] text-[#5A5A5A]">
                          {new Date(featured.publishedAt!).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="font-mono text-[0.75rem] text-[#5A5A5A] group-hover:text-[#101010] transition-colors">
                          Read more →
                        </span>
                      </div>

                    </div>
                  </article>
                </Link>
              );
            })()}

            {/* GRID — remaining posts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(page === 1 && !q && !category ? posts.slice(1) : posts).map((post: { id: string; slug: string; title: string; coverImage: string | null; publishedAt: Date | null; excerpt: string | null; content: unknown; categories: { name: string; slug: string }[] }) => {
                const excerpt = post.excerpt || extractExcerpt(post.content);
                const date = new Date(post.publishedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                return (
                  <article key={post.id} className="group flex flex-col rounded-[1.5rem] overflow-hidden border border-[#CAC8C8] bg-[#ECECEC] hover:shadow-lg transition-shadow duration-300">
                    <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                      {post.coverImage ? (
                        <div className="relative aspect-[16/9] w-full bg-[#CAC8C8]">
                          <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                        </div>
                      ) : (
                        <div className="aspect-[16/9] w-full bg-[#CAC8C8] flex items-center justify-center">
                          <span className="text-[#e4e4e4] text-4xl">✦</span>
                        </div>
                      )}
                    </Link>
                    <div className="flex flex-col flex-1 p-5">
                      {post.categories[0] && (
                        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#5A5A5A] mb-2">{post.categories[0].name}</span>
                      )}
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="font-medium leading-snug text-[#101010] group-hover:text-[#525252] transition-colors mb-2 line-clamp-2" style={{ fontSize: "var(--font-size-body)" }}>{post.title}</h2>
                      </Link>
                      {excerpt && <p className="font-mono text-[0.8rem] text-[#5A5A5A] leading-relaxed line-clamp-2 flex-1">{excerpt}</p>}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#CAC8C8]">
                        <span className="font-mono text-[0.75rem] text-[#5A5A5A]">{date}</span>
                        <Link href={`/blog/${post.slug}`} className="font-mono text-[0.75rem] text-[#5A5A5A] hover:text-[#101010] transition-colors">
                          Read →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-16">
                {page > 1 && (
                  <Link href={`/blog?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}${category ? `&category=${category}` : ""}`}
                    className="px-5 py-2 border border-[#CAC8C8] rounded-xl font-mono text-sm text-[#5A5A5A] hover:bg-[#ECECEC] transition">
                    ← Previous
                  </Link>
                )}
                <span className="font-mono text-sm text-[#5A5A5A]">Page {page} of {totalPages}</span>
                {page < totalPages && (
                  <Link href={`/blog?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}${category ? `&category=${category}` : ""}`}
                    className="px-5 py-2 border border-[#CAC8C8] rounded-xl font-mono text-sm text-[#5A5A5A] hover:bg-[#ECECEC] transition">
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <SiteFooter />
    </>
  );
}
