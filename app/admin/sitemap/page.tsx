import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default async function SitemapPage() {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
    redirect("/admin/login");
  }

  // Static routes
  const staticRoutes = [
    { path: "/", label: "Home" },
    { path: "/blog", label: "Blog" },
    { path: "/about", label: "About" },
    { path: "/founders", label: "Founders" },
    { path: "/developers", label: "Developers" },
    { path: "/technology", label: "Technology" },
    { path: "/community", label: "Community" },
    { path: "/ecosystem", label: "Ecosystem" },
    { path: "/cloud", label: "Cloud" },
    { path: "/private-chat", label: "Private Chat" },
  ];

  // Fetch published blog posts
  let blogPosts: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    blogPosts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { lte: new Date() },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error);
  }

  const allEntries = [
    ...staticRoutes.map((route) => ({
      url: `https://near.org${route.path}`,
      type: "Static",
      lastModified: new Date().toISOString(),
    })),
    ...blogPosts.map((post) => ({
      url: `https://near.org/blog/${post.slug}`,
      type: "Blog Post",
      lastModified: post.updatedAt.toISOString(),
    })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sitemap</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View all URLs included in your sitemap.xml ({allEntries.length} total entries)
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Sitemap Entries</CardTitle>
            <CardDescription>Static routes and published blog posts</CardDescription>
          </div>
          <Button asChild variant="outline">
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="gap-2">
              Open sitemap.xml <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">URL</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground w-24">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground w-48">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                {allEntries.map((entry, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition">
                    <td className="py-3 px-4">
                      <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate block">
                        {entry.url}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        entry.type === "Static"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-green-500/10 text-green-600"
                      }`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {new Date(entry.lastModified).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
