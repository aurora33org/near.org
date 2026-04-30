import Link from "next/link";
import Image from "next/image";
import { prisma } from "@near/cms-core/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { extractExcerpt } from "@near/cms-core/lib/excerpt";
import PostRenderer from "@/components/blog/PostRenderer";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post || post.status !== "PUBLISHED" || (post.publishedAt && post.publishedAt > new Date())) return {};
    return { title: `${post.seoTitle || post.title} — NEAR`, description: post.seoDesc || post.excerpt || extractExcerpt(post.content), openGraph: { title: post.seoTitle || post.title, images: post.ogImage ? [{ url: post.ogImage }] : [] } };
  } catch { return {}; }
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({ where: { status: "PUBLISHED", publishedAt: { lte: new Date() } }, select: { slug: true } });
    return posts.map((p) => ({ slug: p.slug }));
  } catch { return []; }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug }, include: { author: true, categories: true, tags: true } });
  if (!post || post.status !== "PUBLISHED" || (post.publishedAt && post.publishedAt > new Date())) notFound();

  const categoryIds = post.categories.map((c) => c.id);
  const related = await prisma.post.findMany({
    where: { id: { not: post.id }, status: "PUBLISHED", publishedAt: { lte: new Date() }, ...(categoryIds.length > 0 && { categories: { some: { id: { in: categoryIds } } } }) },
    include: { author: true }, orderBy: { publishedAt: "desc" }, take: 3,
  });

  return (
    <>
      <PostRenderer post={post} layout="public" />
      {post.tags.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <p className="text-sm font-semibold text-gray-500 mb-3">Tags</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag.id} href={`/blog/tag/${tag.slug}`} className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full hover:bg-emerald-100 transition">#{tag.name}</Link>
              ))}
            </div>
          </div>
        </div>
      )}
      {related.length > 0 && (
        <div className="border-t border-gray-100 mt-4">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Related posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <article key={p.id} className="group flex flex-col rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                  <Link href={`/blog/${p.slug}`} className="block">
                    {p.coverImage ? (
                      <div className="relative aspect-video w-full bg-emerald-50"><Image src={p.coverImage} alt={p.title} fill className="object-cover" sizes="33vw" /></div>
                    ) : (
                      <div className="aspect-video w-full bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center"><span className="text-emerald-200 text-4xl">✦</span></div>
                    )}
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs text-gray-400 mb-2">{new Date(p.publishedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {p.author.name}</p>
                    <Link href={`/blog/${p.slug}`}><h3 className="text-base font-bold leading-snug text-gray-900 group-hover:text-emerald-700 transition-colors mb-3 line-clamp-2">{p.title}</h3></Link>
                    <Link href={`/blog/${p.slug}`} className="mt-auto text-sm text-emerald-600 hover:text-emerald-800 font-medium">Read more →</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
