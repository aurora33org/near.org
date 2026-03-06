import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function PostsPage() {
  const session = await auth();
  const userRole = (session?.user as any)?.role;
  const userId = session?.user?.id;

  let posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  // Filter posts based on role
  if (userRole !== "ADMIN") {
    posts = posts.filter((post) => post.authorId === userId || userRole === "VIEWER");
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Blog Posts</h1>
        {userRole !== "VIEWER" && (
          <Button asChild>
            <Link href="/admin/posts/new">+ New Post</Link>
          </Button>
        )}
      </div>

      <Card>
        {posts.length === 0 ? (
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No posts yet.</p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/admin/posts/new">Create one</Link>
            </Button>
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-6 py-3 text-left font-medium text-sm">Title</th>
                  <th className="px-6 py-3 text-left font-medium text-sm">Author</th>
                  <th className="px-6 py-3 text-left font-medium text-sm">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-sm">Created</th>
                  <th className="px-6 py-3 text-right font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/20 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium">{post.title}</p>
                      <p className="text-xs text-muted-foreground">{post.slug}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">{post.author.name}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          post.status === "PUBLISHED"
                            ? "default"
                            : post.status === "DRAFT"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {post.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
