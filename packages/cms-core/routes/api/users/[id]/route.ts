import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { auth } from "@cms/lib/auth";
import { prisma } from "@cms/lib/prisma";

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]).optional(),
  password: z.string().min(8).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userRole = (session.user as any)?.role;
  if (userRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { password, ...rest } = parsed.data;

  if (rest.email) {
    const existing = await prisma.user.findFirst({
      where: { email: rest.email, NOT: { id } },
    });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
  }

  const data: any = { ...rest };
  if (password) data.password = await hash(password, 12);

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  try {
    await (prisma as any).auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email ?? "",
        action: "UPDATE",
        entityType: "USER",
        entityId: user.id,
        entityTitle: user.email,
      },
    });
  } catch {}

  return NextResponse.json(user);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userRole = (session.user as any)?.role;
  if (userRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.user.delete({ where: { id } });

  try {
    await (prisma as any).auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email ?? "",
        action: "DELETE",
        entityType: "USER",
        entityId: id,
        entityTitle: user.email,
      },
    });
  } catch {}

  return NextResponse.json({ success: true });
}
