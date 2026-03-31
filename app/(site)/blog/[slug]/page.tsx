import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { renderBlocks } from "@/lib/tiptap-renderer";
import { extractExcerpt } from "@/lib/excerpt";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

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
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!post || post.status !== "PUBLISHED" || (post.publishedAt && post.publishedAt > new Date())) {
    notFound();
  }

  // Render TipTap content as HTML
  const content = post.content as any;

  const heroStyle: React.CSSProperties = post.heroBgImage
    ? { backgroundImage: `url(${post.heroBgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : post.heroBgColor
    ? { backgroundColor: post.heroBgColor }
    : {};

  return (
    <>
      {/* HERO */}
      <div style={heroStyle}>
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-12">
          <Link href="/blog" className="text-sm opacity-70 hover:opacity-100 mb-6 block transition">
            Blog
          </Link>
          <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
          <p className="text-sm opacity-70 mb-8">
            {new Date(post.publishedAt!).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
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
      </div>
    </>
  );
}
