import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const LOCK_TTL_MS = 90_000; // 90 seconds

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, lockedBy: true, lockedByEmail: true, lockedAt: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const now = new Date();
  const isStale =
    !post.lockedAt || now.getTime() - post.lockedAt.getTime() > LOCK_TTL_MS;
  const isOwnLock = post.lockedBy === session.user.id;

  if (post.lockedBy && !isStale && !isOwnLock) {
    // Locked by someone else and still fresh
    return NextResponse.json(
      {
        acquired: false,
        lockedByEmail: post.lockedByEmail,
        lockedAt: post.lockedAt,
      },
      { status: 409 }
    );
  }

  const displayName =
    (session.user as any).name || session.user.email || session.user.id;

  await prisma.post.update({
    where: { id },
    data: {
      lockedBy: session.user.id,
      lockedByEmail: displayName,
      lockedAt: now,
    },
  });

  return NextResponse.json({ acquired: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: { lockedBy: true, lockedByEmail: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const userRole = (session.user as any).role;
  const isOwnLock = post.lockedBy === session.user.id;
  const isAdmin = userRole === "ADMIN";

  // Allow lock release if user owns the lock OR is an admin
  if (!isOwnLock && !isAdmin) {
    return NextResponse.json({ error: "Not your lock" }, { status: 403 });
  }

  await prisma.post.update({
    where: { id },
    data: { lockedBy: null, lockedByEmail: null, lockedAt: null },
  });

  revalidatePath("/admin/posts");

  return NextResponse.json({ released: true });
}
