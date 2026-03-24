import React from "react";
import { prisma } from "@/lib/prisma";
import { renderBlocks } from "@/lib/tiptap-renderer";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import PreviewPasswordForm from "./PreviewPasswordForm";

export default async function SharedPreviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const post = await prisma.post.findUnique({
    where: { previewToken: token },
    include: { author: true },
  });

  if (!post || !post.previewToken) notFound();

  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get(`preview_${token}`)?.value === "1";

  if (!isAuthenticated) {
    return <PreviewPasswordForm token={token} />;
  }

  const content = post.content as any;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-center py-3 text-sm font-medium">
        DRAFT PREVIEW — {post.title}
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
              <span className="text-sm opacity-70 mb-6 block">Blog</span>
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
