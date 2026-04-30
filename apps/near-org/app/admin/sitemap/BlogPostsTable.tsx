"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@near/cms-core/components/ui/card";
import { SitemapPostToggle } from "./SitemapPostToggle";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  updatedAt: Date;
  excludeFromSitemap: boolean;
}

interface BlogPostsTableProps {
  blogPosts: BlogPost[];
}

export function BlogPostsTable({ blogPosts }: BlogPostsTableProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Blog Posts</CardTitle>
        <CardDescription>Click the status badge to include or exclude a post from the sitemap.</CardDescription>
      </CardHeader>
      <CardContent>
        {blogPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No published posts yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">URL</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground w-36">Last Modified</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground w-28">Sitemap</th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.map((post) => (
                  <tr key={post.id} className="border-b border-border/50 hover:bg-muted/30 transition">
                    <td className="py-3 px-4 font-medium max-w-xs truncate">{post.title}</td>
                    <td className="py-3 px-4">
                      <a href={`https://near.org/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-mono text-xs">
                        /blog/{post.slug}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {post.updatedAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="py-3 px-4">
                      <SitemapPostToggle postId={post.id} excluded={post.excludeFromSitemap} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
