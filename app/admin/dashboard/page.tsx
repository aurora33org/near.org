import { auth } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  const session = await auth();
  const [postsCount, pagesCount, usersCount] = await Promise.all([
    prisma.post.count(),
    prisma.page.count(),
    prisma.user.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Welcome, <span className="font-bold text-foreground">{session?.user?.name}</span>!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Blog Posts</CardDescription>
            <CardTitle className="text-4xl">{postsCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="p-0">
              <Link href="/admin/posts">Manage Posts →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pages</CardDescription>
            <CardTitle className="text-4xl">{pagesCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="p-0">
              <Link href="/admin/pages">Manage Pages →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Users</CardDescription>
            <CardTitle className="text-4xl">{usersCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="p-0">
              <Link href="/admin/users">Manage Users →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button asChild>
            <Link href="/admin/posts/new">+ New Post</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/admin/pages/new">+ New Page</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
