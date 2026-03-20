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

      <article className="max-w-2xl mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">{post.title}</h1>

        <div className="flex items-center gap-4 mb-8 text-gray-600">
          <span>{post.author.name}</span>
          <span>•</span>
          <span>
            {new Date(post.updatedAt).toLocaleDateString()} (last updated)
          </span>
          <span>•</span>
          <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">
            {post.status}
          </span>
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
    </div>
  );
}
