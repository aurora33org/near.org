import { auth } from "@cms/lib/auth";
import { prisma } from "@cms/lib/prisma";
import { compare, hash } from "bcryptjs";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /api/users/me error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { name, currentPassword, newPassword } = body;

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updateData: any = {};

    // Update name if provided
    if (name !== undefined && name !== null && name.trim()) {
      updateData.name = name.trim();
    }

    // Update password if provided (requires current password verification)
    if (newPassword) {
      if (!currentPassword) {
        return new Response(
          JSON.stringify({ error: "Current password required to set new password" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Verify current password
      const isPasswordValid = await compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return new Response(JSON.stringify({ error: "Current password is incorrect" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Hash new password (cost 13 for security consistency)
      updateData.password = await hash(newPassword, 13);
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: "No fields to update" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PATCH /api/users/me error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
