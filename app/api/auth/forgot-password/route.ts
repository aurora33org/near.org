import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

const forgotRateLimit = new Map<string, { count: number; resetAt: number }>();
function checkForgotRateLimit(email: string): boolean {
  const now = Date.now();
  const entry = forgotRateLimit.get(email);
  if (!entry || now > entry.resetAt) {
    forgotRateLimit.set(email, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 1) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (!checkForgotRateLimit(email.toLowerCase().trim())) {
    return NextResponse.json({ success: true }); // Don't reveal rate limit to prevent enumeration
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
