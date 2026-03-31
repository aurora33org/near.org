import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await req.json();
    const { password } = body as { password: string };

    const post = await prisma.post.findUnique({
      where: { previewToken: token },
    });

    if (!post || !post.previewPassword) {
      return NextResponse.json({ error: "Invalid preview link" }, { status: 404 });
    }

    if (password !== post.previewPassword) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    const host = req.headers.get("host") ?? "";
    const isLocal = host.includes("localhost") || host.startsWith("127.") || host.startsWith("[::1]");
    const protocol = isLocal ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    const response = NextResponse.redirect(`${baseUrl}/preview/${token}`, 302);
    response.cookies.set(`preview_${token}`, "1", {
      httpOnly: true,
      maxAge: 86400,
      path: `/preview/${token}`,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error verifying preview password:", error);
    return NextResponse.json(
      { error: "Failed to verify password" },
      { status: 500 }
    );
  }
}
