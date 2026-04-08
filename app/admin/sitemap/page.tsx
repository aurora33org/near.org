import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { BlogPostsTable } from "./BlogPostsTable";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  updatedAt: Date;
  excludeFromSitemap: boolean;
}

async function fetchSitemapData() {
  // Static routes — always included, can't be toggled
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

  // All published posts with their sitemap status
  let blogPosts: BlogPost[] = [];
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
      select: { id: true, title: true, slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    });
    blogPosts = posts.map(p => ({
      ...p,
      excludeFromSitemap: false
    }));
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error);
  }

  return { staticRoutes, blogPosts };
}

export default async function SitemapPage() {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
    redirect("/admin/login");
  }

  const { staticRoutes, blogPosts } = await fetchSitemapData();
  const includedCount = staticRoutes.length + blogPosts.filter((p) => !p.excludeFromSitemap).length;
  const excludedCount = blogPosts.filter((p) => p.excludeFromSitemap).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sitemap</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {includedCount} URLs included · {excludedCount} excluded
          </p>
        </div>
        <Button asChild variant="outline">
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="gap-2">
            Open sitemap.xml <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>

      {/* Static Routes */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Static Routes</CardTitle>
          <CardDescription>Hardcoded pages — always included. Edit <code>app/sitemap.ts</code> to change.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Page</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">URL</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground w-28">Status</th>
                </tr>
              </thead>
              <tbody>
                {staticRoutes.map((route) => (
                  <tr key={route.path} className="border-b border-border/50 hover:bg-muted/30 transition">
                    <td className="py-3 px-4 font-medium">{route.label}</td>
                    <td className="py-3 px-4">
                      <a href={`https://near.org${route.path}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-mono text-xs">
                        /near.org{route.path}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/10 text-green-600">
                        Included
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts */}
      <BlogPostsTable blogPosts={blogPosts} />
    </div>
  );
}
