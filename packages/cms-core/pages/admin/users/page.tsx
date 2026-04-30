import { auth } from "@cms/lib/auth";
import { prisma } from "@cms/lib/prisma";
import { UsersClient } from "./UsersClient";

export default async function UsersPage() {
  const session = await auth();
  const userRole = (session?.user as any)?.role;

  if (userRole !== "ADMIN") {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">You don&apos;t have permission to access this page.</p>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true, lastLoginAt: true },
  });

  return (
    <UsersClient
      initialUsers={users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
        lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
      }))}
      currentUserId={session!.user!.id!}
    />
  );
}
