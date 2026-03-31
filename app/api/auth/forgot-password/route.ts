import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Always return success to prevent user enumeration
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) {
    return NextResponse.json({ success: true });
  }

  // Clean up expired tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email: user.email, expiresAt: { lt: new Date() } },
  });

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { token, email: user.email, expiresAt },
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const resetUrl = `${baseUrl}/admin/reset-password/${token}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl);
  } catch {
    // Don't leak email errors to the client
  }

  return NextResponse.json({ success: true });
}
