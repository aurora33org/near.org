import Link from "next/link";
import Image from "next/image";
import { prisma } from "@near/cms-core/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { extractExcerpt } from "@near/cms-core/lib/excerpt";
import PostRenderer from "@/components/blog/PostRenderer";
import SiteFooter from "@/components/site/SiteFooter";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post || post.status !== "PUBLISHED" || (post.publishedAt && post.publishedAt > new Date())) return {};
    return {
      title: `${post.seoTitle || post.title} — NEAR AI`,
      description: post.seoDesc || post.excerpt || extractExcerpt(post.content),
      openGraph: {
        title: post.seoTitle || post.title,
        description: post.seoDesc || post.excerpt || extractExcerpt(post.content),
        images: post.ogImage ? [{ url: post.ogImage }] : [],
      },
    };
  } catch { return {}; }
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
      select: { slug: true },
    });
    return posts.map((p: { slug: string }) => ({ slug: p.slug }));
  } catch { return []; }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true, categories: true, tags: true },
  });

  if (!post || post.status !== "PUBLISHED" || (post.publishedAt && post.publishedAt > new Date())) notFound();

  const categoryIds = post!.categories.map((c: { id: string }) => c.id);
  const related = await prisma.post.findMany({
    where: {
      id: { not: post.id },
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
      ...(categoryIds.length > 0 && { categories: { some: { id: { in: categoryIds } } } }),
    },
    include: { author: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <>
      <PostRenderer post={post} layout="public" />

      {/* TAGS */}
      {post.tags.length > 0 && (
        <div className="border-t border-[#CAC8C8]">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#5A5A5A] mb-4">Tags</p>
            <div className="flex flex-wrap gap-2">
              {post!.tags.map((tag: { id: string; slug: string; name: string }) => (
                <Link key={tag.id} href={`/blog/tag/${tag.slug}`}
                  className="font-mono text-[0.75rem] bg-[#ECECEC] text-[#5A5A5A] px-4 py-1.5 rounded-full hover:bg-[#CAC8C8] transition">
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RELATED */}
      {related.length > 0 && (
        <div className="border-t border-[#CAC8C8] mt-4">
          <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20 py-16">
            <h2
              className="font-medium text-[#101010] mb-10"
              style={{ fontSize: "var(--font-size-h2)" }}
            >Related posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p: { id: string; slug: string; title: string; coverImage: string | null; publishedAt: Date | null; author: { name: string | null } }) => (
                <article key={p.id} className="group flex flex-col rounded-[1.5rem] overflow-hidden border border-[#CAC8C8] bg-[#ECECEC] hover:shadow-lg transition-shadow duration-300">
                  <Link href={`/blog/${p.slug}`} className="block overflow-hidden">
                    {p.coverImage ? (
                      <div className="relative aspect-video w-full bg-[#CAC8C8]">
                        <Image src={p.coverImage} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-[#CAC8C8] flex items-center justify-center">
                        <span className="text-[#e4e4e4] text-4xl">✦</span>
                      </div>
                    )}
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="font-mono text-[0.75rem] text-[#5A5A5A] mb-2">
                      {new Date(p.publishedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <Link href={`/blog/${p.slug}`}>
                      <h3 className="font-medium leading-snug text-[#101010] group-hover:text-[#525252] transition-colors mb-3 line-clamp-2" style={{ fontSize: "var(--font-size-body)" }}>{p.title}</h3>
                    </Link>
                    <Link href={`/blog/${p.slug}`} className="mt-auto font-mono text-[0.75rem] text-[#5A5A5A] hover:text-[#101010] transition-colors">
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </>
  );
}
