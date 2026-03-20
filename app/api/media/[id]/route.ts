import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { filename, alt } = await req.json();

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.media.update({
    where: { id },
    data: {
      ...(filename !== undefined && { filename }),
      ...(alt !== undefined && { alt }),
    },
  });
  return NextResponse.json(updated);
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

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.media.delete({ where: { id } });

  try {
    await (prisma as any).auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email ?? "",
        action: "DELETE",
        entityType: "MEDIA",
        entityId: media.id,
        entityTitle: media.filename,
      },
    });
  } catch {}

  return NextResponse.json({ success: true });
}
