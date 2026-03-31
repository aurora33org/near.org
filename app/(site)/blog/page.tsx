import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { extractExcerpt } from "@/lib/excerpt";
import { Metadata } from "next";
import ThreadsClient from "@/components/site/ThreadsClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — NEAR Protocol",
  description:
    "Latest news, updates, and insights from the NEAR Protocol ecosystem.",
  openGraph: {
    type: "website",
    url: "https://near.org/blog",
    siteName: "NEAR Protocol",
    title: "Blog — NEAR Protocol",
    description:
      "Latest news, updates, and insights from the NEAR Protocol ecosystem.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — NEAR Protocol",
    description:
      "Latest news, updates, and insights from the NEAR Protocol ecosystem.",
  },
};

const PAGE_SIZE = 12;

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));
  const skip = (page - 1) * PAGE_SIZE;

  const now = new Date();
  const publishedWhere = { status: "PUBLISHED" as const, publishedAt: { lte: now } };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: publishedWhere,
      orderBy: { publishedAt: "desc" },
      take: PAGE_SIZE,
      skip,
      select: { id: true, slug: true, title: true, coverImage: true, publishedAt: true, excerpt: true, content: true },
    }),
    prisma.post.count({ where: publishedWhere }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const T = { fontFamily: "var(--font-tech)" };
  const D = { fontFamily: "var(--font-display)" };

  return (
    <div className="bg-white text-black">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-black flex items-center overflow-hidden" style={{ minHeight: "38vh" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          <ThreadsClient color={[0.345, 0.584, 0.847]} amplitude={0.8} distance={0.6} enableMouseInteraction />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} aria-hidden="true" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-8 py-14">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase mb-4">Blog</p>
          <h1 style={D} className="text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            Insights on Private AI,<br className="hidden sm:block" /> Confidential Compute &amp; What&apos;s Next
          </h1>
        </div>
      </section>

      {/* ── POSTS ────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-8 py-16">

      {posts.length === 0 ? (
        <p className="text-gray-600">No posts yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map((post) => {
              const excerpt = post.excerpt || extractExcerpt(post.content);
              const date = new Date(post.publishedAt!).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return (
                <article
                  key={post.id}
                  className="group flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-xl transition-shadow duration-300"
                >
                  <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                    {post.coverImage ? (
                      <div className="relative aspect-[16/9] w-full bg-gray-100">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-gray-300 text-5xl">✦</span>
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-col flex-1 p-6">
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors mb-3">
                        {post.title}
                      </h2>
                    </Link>
                    {excerpt && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
                        {excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400 font-medium">{date}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-colors px-3 py-1.5 rounded-full"
                      >
                        Read more
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-16">
              {page > 1 && (
                <Link
                  href={`/blog?page=${page - 1}`}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  ← Previous
                </Link>
              )}
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/blog?page=${page + 1}`}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}
