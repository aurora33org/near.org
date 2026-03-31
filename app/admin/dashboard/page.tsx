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

  let recentActivity: any[] = [];
  try {
    recentActivity = await (prisma as any).auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  } catch {}

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

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Last 10 actions across the CMS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {recentActivity.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        log.action === "CREATE"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : log.action === "DELETE"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="text-muted-foreground">{log.entityType}</span>
                    <span className="font-medium truncate max-w-xs">{log.entityTitle}</span>
                  </div>
                  <div className="text-muted-foreground text-xs flex items-center gap-2">
                    <span>{log.userEmail}</span>
                    <time suppressHydrationWarning>{new Date(log.createdAt).toLocaleString()}</time>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
