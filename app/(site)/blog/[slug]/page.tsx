import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { renderBlocks } from "@/lib/tiptap-renderer";

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

  if (!post || post.status !== "PUBLISHED") {
    return {};
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDesc || post.excerpt || "",
      images: post.ogImage ? [{ url: post.ogImage }] : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
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

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  // Render TipTap content as HTML
  const content = post.content as any;

  return (
    <article className="max-w-2xl mx-auto px-4 py-20">
      <Link href="/blog" className="text-blue-600 hover:underline mb-8 block">
        ← Back to blog
      </Link>

      <h1 className="text-5xl font-bold mb-4">{post.title}</h1>

      <div className="flex items-center gap-4 mb-8 text-gray-600">
        <span>{post.author.name}</span>
        <span>•</span>
        <span>{new Date(post.publishedAt!).toLocaleDateString()}</span>
      </div>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
      )}

      <div className="prose prose-lg max-w-none">
        {renderBlocks(content?.content ?? [])}
      </div>
    </article>
  );
}
