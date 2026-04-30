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
      <section className="bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 min-h-[70vh] flex items-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-emerald-300 text-xs tracking-widest uppercase font-mono mb-6">NEAR</p>
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
            The blockchain<br />for everyone
          </h1>
          <p className="text-emerald-200 text-xl max-w-xl mx-auto mb-10">
            Simple, scalable, and secure. Build the open web on NEAR.
          </p>
          <Link href="/blog" className="px-8 py-4 bg-white text-emerald-900 font-semibold rounded-xl hover:bg-emerald-50 transition">
            Read the Blog
          </Link>
        </div>
      </section>

      {recentPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Latest from the blog</h2>
            <Link href="/blog" className="text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition">View all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block p-6 rounded-2xl border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition">
                <p className="text-xs text-gray-400 mb-3">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt || extractExcerpt(post.content)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
