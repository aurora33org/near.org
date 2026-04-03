import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { renderBlocks } from "@/lib/tiptap-renderer";
import { extractExcerpt } from "@/lib/excerpt";
import { readingTime } from "@/lib/readingTime";
import { extractHeadings } from "@/lib/extractHeadings";
import TableOfContents from "@/components/(site)/TableOfContents";
import ReadingProgressBar from "@/components/site/ReadingProgressBar";
import ShareButtons from "@/components/site/ShareButtons";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let post;
  try {
    post = await prisma.post.findUnique({ where: { slug } });
  } catch {
    return {};
  }

  if (!post || post.status !== "PUBLISHED" || (post.publishedAt && post.publishedAt > new Date())) {
    return {};
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt || extractExcerpt(post.content),
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDesc || post.excerpt || extractExcerpt(post.content),
      images: post.ogImage ? [{ url: post.ogImage }] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
      select: { slug: true },
    });
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true, categories: true, tags: true },
  });

  if (!post || post.status !== "PUBLISHED" || (post.publishedAt && post.publishedAt > new Date())) {
    notFound();
  }

  const content = post.content as any;
  const headings = extractHeadings(content);
  const showToc = headings.length >= 2;

  // Related posts — same categories, fallback to latest
  const categoryIds = post.categories.map((c) => c.id);
  const related = await prisma.post.findMany({
    where: {
      id: { not: post.id },
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
      ...(categoryIds.length > 0 && {
        categories: { some: { id: { in: categoryIds } } },
      }),
    },
    include: { author: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  const heroStyle: React.CSSProperties = post.heroBgImage
    ? { backgroundImage: `url(${post.heroBgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : post.heroBgColor
    ? { backgroundColor: post.heroBgColor }
    : {};

  return (
    <>
      <ReadingProgressBar />
      {/* HERO */}
      <div style={heroStyle}>
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-12">
          <Link href="/blog" className="text-sm text-black opacity-70 hover:opacity-100 mb-6 block transition">
            Blog
          </Link>
          <h1 className="text-5xl font-bold mb-4 text-black">{post.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog/category/${cat.slug}`}
                className="text-xs bg-opacity-20 bg-blue-500 text-blue-700 px-2 py-1 rounded hover:bg-opacity-30 transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <p className="text-sm text-black opacity-70 mb-8">
            {new Date(post.publishedAt!).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {post.author.name} · {readingTime(content)}
          </p>
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full rounded-lg object-cover"
            />
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          {renderBlocks(content?.content ?? [])}
        </div>

        {/* SHARE BUTTONS */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <ShareButtons
            url={`https://near.org/blog/${post.slug}`}
            title={post.title}
          />
        </div>
      </div>

      {/* TOC — floating, fixed position, wide desktop only */}
      {showToc && (
        <div className="hidden xl:block fixed right-8 top-24 w-52 z-40">
          <TableOfContents headings={headings} />
        </div>
      )}

      {/* TAGS */}
      {post.tags.length > 0 && (
        <div className="border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <p className="text-sm font-semibold text-gray-600 mb-4">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RELATED POSTS */}
      {related.length > 0 && (
        <div className="border-t border-gray-200 mt-4">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold mb-8">Related posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <article
                  key={p.id}
                  className="flex flex-col rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <Link href={`/blog/${p.slug}`} className="block">
                    {p.coverImage ? (
                      <div className="relative aspect-video w-full bg-gray-100">
                        <Image
                          src={p.coverImage}
                          alt={p.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-300 text-4xl">✦</span>
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-col flex-1 p-5">
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(p.publishedAt!).toLocaleDateString()} · {p.author.name}
                    </p>
                    <Link href={`/blog/${p.slug}`}>
                      <h3 className="text-lg font-bold leading-snug hover:text-gray-600 mb-2">
                        {p.title}
                      </h3>
                    </Link>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="mt-auto text-sm text-blue-600 hover:underline font-medium"
                    >
                      Read more →
                    </Link>
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
