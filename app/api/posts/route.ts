import { NextRequest, NextResponse } from "next/server";
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
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 20)));
    const skip = (page - 1) * limit;

    const where =
      session?.user?.id && (session.user as any)?.role !== "ADMIN"
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

    const post = await prisma.post.create({
      data: {
        ...data,
        authorId: session.user.id,
        publishedAt:
          data.status === "PUBLISHED" ? new Date() : null,
      },
      include: { author: true },
    });

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
