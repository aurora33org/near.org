import { auth } from "@cms/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@cms/components/ui/card";
import { Button } from "@cms/components/ui/button";
import { ExternalLink } from "lucide-react";

export default async function RobotsPage() {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
    redirect("/admin/login");
  }

  let robotsContent = "";

  try {
    const response = await fetch("https://near.org/robots.txt", {
      cache: "no-store",
    });
    if (response.ok) {
      robotsContent = await response.text();
    }
  } catch (error) {
    console.error("Failed to fetch robots.txt:", error);
    robotsContent = "Error loading robots.txt";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Robots.txt</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Current crawling and indexing rules for search engines
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Robots.txt Content</CardTitle>
            <CardDescription>Live configuration</CardDescription>
          </div>
          <Button asChild variant="outline">
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="gap-2">
              Open robots.txt <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-foreground whitespace-pre-wrap break-words">
              {robotsContent}
            </pre>
          </div>
          <p className="text-xs text-muted-foreground">
            To edit these rules, modify <code className="bg-muted px-2 py-1 rounded">app/robots.ts</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
