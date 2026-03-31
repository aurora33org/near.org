import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.any(), // TipTap JSON
  excerpt: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  coverImage: z.string().optional(),
  ogImage: z.string().optional(),
  heroBgColor: z.string().optional(),
  heroBgImage: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  publishedAt: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 20)));
    const skip = (page - 1) * limit;

    const userRole = (session?.user as any)?.role;
    const where =
      session?.user?.id && userRole === "VIEWER"
        ? { authorId: session.user.id }
        : {};

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { author: true, tags: true, categories: true },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({ posts, total, page, limit });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createPostSchema.parse(body);

    // Check if slug is unique
    const existingPost = await prisma.post.findUnique({
      where: { slug: data.slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const { categoryIds, tagIds, publishedAt, ...postData } = data;

    const resolvedPublishedAt = data.status === "PUBLISHED"
      ? (publishedAt ? new Date(publishedAt) : new Date())
      : null;

    const post = await prisma.post.create({
      data: {
        ...postData,
        authorId: session.user.id,
        publishedAt: resolvedPublishedAt,
        categories: categoryIds?.length
          ? { connect: categoryIds.map((id) => ({ id })) }
          : undefined,
        tags: tagIds?.length
          ? { connect: tagIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { author: true },
    });

    try {
      await (prisma as any).auditLog.create({
        data: {
          userId: session.user.id,
          userEmail: session.user.email ?? "",
          action: "CREATE",
          entityType: "POST",
          entityId: post.id,
          entityTitle: post.title,
        },
      });
    } catch {}

    if (post.status === "PUBLISHED") {
      revalidatePath("/blog");
      revalidatePath(`/blog/${post.slug}`);
      revalidatePath("/feed.xml");
      revalidatePath("/sitemap.xml");
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
