import Link from "next/link";
import { prisma } from "@near/cms-core/lib/prisma";
import { extractExcerpt } from "@near/cms-core/lib/excerpt";

export const revalidate = 60;

export default async function Home() {
  let recentPosts: any[] = [];
  try {
    recentPosts = await prisma.post.findMany({
      where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { slug: true, title: true, excerpt: true, content: true, publishedAt: true },
    });
  } catch {}

  return (
    <div className="bg-white text-black">
      {/* HERO */}
      <section className="bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 min-h-[70vh] flex items-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-purple-300 text-xs tracking-widest uppercase font-mono mb-6">NEAR AI</p>
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Private AI<br />for everyone
          </h1>
          <p className="text-purple-200 text-xl max-w-xl mx-auto mb-10">
            Build AI applications that respect user privacy. Powered by NEAR's confidential compute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog" className="px-8 py-4 bg-white text-purple-900 font-semibold rounded-xl hover:bg-purple-50 transition">
              Read the Blog
            </Link>
          </div>
        </div>
      </section>

      {/* RECENT POSTS */}
      {recentPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Latest from the blog</h2>
            <Link href="/blog" className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block p-6 rounded-2xl border border-gray-200 hover:border-purple-200 hover:shadow-lg transition">
                <p className="text-xs text-gray-400 mb-3">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt || extractExcerpt(post.content)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
