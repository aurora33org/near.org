import Link from "next/link";
import Image from "next/image";
import { prisma } from "@near/cms-core/lib/prisma";
import { notFound } from "next/navigation";
import { extractExcerpt } from "@near/cms-core/lib/excerpt";
import { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

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
    <>
      {/* HERO */}
      <section className="relative bg-[#101010] min-h-[360px] flex flex-col">
        <div className="relative z-10 flex flex-col flex-1 mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">
          <SiteHeader />
          <div className="flex flex-col flex-1 justify-end pb-16 lg:pb-20">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-white/50 mb-4">Category</span>
            <h1
              className="text-white font-medium leading-[1.05] tracking-tight"
              style={{ fontSize: "var(--font-size-h1)" }}
            >{category.name}</h1>
            <p className="mt-3 font-mono text-white/50 text-[0.75rem]">{total} post{total !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4 text-[#CAC8C8]">✦</p>
            <p className="font-mono text-[#5A5A5A]" style={{ fontSize: "var(--font-size-body)" }}>No posts in this category yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: { id: string; slug: string; title: string; coverImage: string | null; publishedAt: Date | null; excerpt: string | null; content: unknown; author: { name: string | null } }) => {
                const excerpt = post.excerpt || extractExcerpt(post.content);
                return (
                  <article key={post.id} className="group flex flex-col rounded-[1.5rem] overflow-hidden border border-[#CAC8C8] bg-[#ECECEC] hover:shadow-lg transition-shadow duration-300">
                    <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                      {post.coverImage ? (
                        <div className="relative aspect-[16/9] w-full bg-[#CAC8C8]">
                          <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
                        </div>
                      ) : (
                        <div className="aspect-[16/9] w-full bg-[#CAC8C8] flex items-center justify-center">
                          <span className="text-[#e4e4e4] text-4xl">✦</span>
                        </div>
                      )}
                    </Link>
                    <div className="flex flex-col flex-1 p-5">
                      <p className="font-mono text-[0.75rem] text-[#5A5A5A] mb-2">
                        {new Date(post.publishedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {post.author.name}
                      </p>
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="font-medium leading-snug text-[#101010] group-hover:text-[#525252] transition-colors mb-2 line-clamp-2" style={{ fontSize: "var(--font-size-body)" }}>{post.title}</h2>
                      </Link>
                      {excerpt && <p className="font-mono text-[0.8rem] text-[#5A5A5A] leading-relaxed line-clamp-2 flex-1">{excerpt}</p>}
                      <Link href={`/blog/${post.slug}`} className="mt-4 font-mono text-[0.75rem] text-[#5A5A5A] hover:text-[#101010] transition-colors">Read more →</Link>
                    </div>
                  </article>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-16">
                {page > 1 && <Link href={`/blog/category/${slug}?page=${page - 1}`} className="px-5 py-2 border border-[#CAC8C8] rounded-xl font-mono text-sm text-[#5A5A5A] hover:bg-[#ECECEC] transition">← Previous</Link>}
                <span className="font-mono text-sm text-[#5A5A5A]">Page {page} of {totalPages}</span>
                {page < totalPages && <Link href={`/blog/category/${slug}?page=${page + 1}`} className="px-5 py-2 border border-[#CAC8C8] rounded-xl font-mono text-sm text-[#5A5A5A] hover:bg-[#ECECEC] transition">Next →</Link>}
              </div>
            )}
          </>
        )}
      </div>

      <SiteFooter />
    </>
  );
}
