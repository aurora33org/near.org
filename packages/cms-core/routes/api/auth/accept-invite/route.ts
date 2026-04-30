import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@cms/lib/prisma";
import { z } from "zod";
import { hash } from "bcryptjs";

const acceptInviteSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const invitation = await prisma.invitationToken.findUnique({
      where: { token },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invitation expired" }, { status: 400 });
    }

    return NextResponse.json({
      email: invitation.email,
      name: invitation.name,
      role: invitation.role,
    });
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitation" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = acceptInviteSchema.parse(body);

    const invitation = await prisma.invitationToken.findUnique({
      where: { token: data.token },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invitation expired" }, { status: 400 });
    }

    // Check if email already exists (race condition check)
    const existingUser = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(data.password, 13);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: invitation.email,
        name: invitation.name,
        password: hashedPassword,
        role: invitation.role,
      },
    });

    // Delete invitation token
    await prisma.invitationToken.delete({
      where: { id: invitation.id },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          ...(process.env.NODE_ENV === "development" && { details: error.issues }),
        },
        { status: 400 }
      );
    }

    console.error("Error accepting invitation:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}
