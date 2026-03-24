import React from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderBlocks } from "@/lib/tiptap-renderer";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!post) notFound();

  const content = post.content as any;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-center py-3 text-sm font-medium">
        DRAFT PREVIEW — This post is not published.{" "}
        <Link
          href={`/admin/posts/${id}/edit`}
          className="underline font-semibold"
        >
          Back to editor
        </Link>
      </div>

      {/* HERO */}
      {(() => {
        const heroStyle: React.CSSProperties = (post as any).heroBgImage
          ? { backgroundImage: `url(${(post as any).heroBgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
          : (post as any).heroBgColor
          ? { backgroundColor: (post as any).heroBgColor }
          : {};
        return (
          <div style={heroStyle}>
            <div className="max-w-4xl mx-auto px-4 pt-16 pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm opacity-70">Blog</span>
                <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">
                  {post.status}
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
              <p className="text-sm opacity-70 mb-8">
                {new Date(post.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} (last updated)
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
        );
      })()}

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          {renderBlocks(content?.content ?? [])}
        </div>
      </div>
    </div>
  );
}
