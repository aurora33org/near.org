import { NextRequest, NextResponse } from "next/server";
import { auth } from "@near/cms-core/lib/auth";
import { prisma } from "@near/cms-core/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== "ADMIN" && post.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { password, regenerate } = body as {
      password: string;
      regenerate?: boolean;
    };

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const token =
      !post.previewToken || regenerate
        ? crypto.randomUUID()
        : post.previewToken;

    const hashedPassword = await hash(password, 12);
    await prisma.post.update({
      where: { id },
      data: { previewToken: token, previewPassword: hashedPassword },
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error creating preview link:", error);
    return NextResponse.json(
      { error: "Failed to create preview link" },
      { status: 500 }
    );
  }
}
