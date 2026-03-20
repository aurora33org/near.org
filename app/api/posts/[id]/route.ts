import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  content: z.any().optional(),
  excerpt: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  coverImage: z.string().optional(),
  ogImage: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  publishedAt: z.string().optional().nullable(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true, tags: true, categories: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const userRole = (session.user as any)?.role;
    // Check permissions: Admin can edit all, Editor can edit own
    if (userRole !== "ADMIN" && post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own posts" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const data = updatePostSchema.parse(body);

    // Check if new slug is unique (if changed)
    if (data.slug && data.slug !== post.slug) {
      const existingPost = await prisma.post.findUnique({
        where: { slug: data.slug },
      });
      if (existingPost) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const { categoryIds, tagIds, publishedAt, ...postData } = data;

    const resolvedPublishedAt = data.publishedAt
      ? new Date(data.publishedAt)
      : data.status === "PUBLISHED" && post.status !== "PUBLISHED"
      ? new Date()
      : post.publishedAt;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...postData,
        publishedAt: resolvedPublishedAt,
        categories: categoryIds !== undefined
          ? { set: categoryIds.map((id) => ({ id })) }
          : undefined,
        tags: tagIds !== undefined
          ? { set: tagIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { author: true },
    });

    try {
      await (prisma as any).auditLog.create({
        data: {
          userId: session.user.id,
          userEmail: session.user.email ?? "",
          action: "UPDATE",
          entityType: "POST",
          entityId: updatedPost.id,
          entityTitle: updatedPost.title,
        },
      });
    } catch {}

    return NextResponse.json(updatedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const userRole = (session.user as any)?.role;
    // Check permissions: Admin can delete all, Editor can delete own
    if (userRole !== "ADMIN" && post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own posts" },
        { status: 403 }
      );
    }

    await prisma.post.delete({
      where: { id },
    });

    try {
      await (prisma as any).auditLog.create({
        data: {
          userId: session.user.id,
          userEmail: session.user.email ?? "",
          action: "DELETE",
          entityType: "POST",
          entityId: post.id,
          entityTitle: post.title,
        },
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
