import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import PostRenderer from "@/components/blog/PostRenderer";

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
    include: { author: true, categories: true },
  });

  if (!post) notFound();

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

      <PostRenderer post={post} layout="admin" />
    </div>
  );
}
