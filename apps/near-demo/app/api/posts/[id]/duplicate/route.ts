import { NextRequest, NextResponse } from "next/server";
import { auth } from "@near/cms-core/lib/auth";
import { prisma } from "@near/cms-core/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const original = await prisma.post.findUnique({
    where: { id },
    include: { categories: true, tags: true },
  });

  if (!original) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== "ADMIN" && original.authorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const newSlug = `${original.slug}-copy-${Date.now()}`;

  const duplicate = await prisma.post.create({
    data: {
      title: `Copy of ${original.title}`,
      slug: newSlug,
      content: original.content as any,
      excerpt: original.excerpt,
      coverImage: original.coverImage,
      seoTitle: original.seoTitle,
      seoDesc: original.seoDesc,
      ogImage: original.ogImage,
      status: "DRAFT",
      publishedAt: null,
      authorId: session.user.id,
      categories: original.categories.length
        ? { connect: original.categories.map((c) => ({ id: c.id })) }
        : undefined,
      tags: original.tags.length
        ? { connect: original.tags.map((t) => ({ id: t.id })) }
        : undefined,
    },
  });

  return NextResponse.json(duplicate, { status: 201 });
}
