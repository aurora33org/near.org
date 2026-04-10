import Link from "next/link";
import { auth } from "@/lib/auth";
import { ClipboardList, Map, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdvancedPage() {
  const session = await auth();
  const userRole = (session?.user as any)?.role;

  if (userRole !== "ADMIN") {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">You don't have permission to access this page.</p>
      </div>
    );
  }

  const options = [
    {
      href: "/admin/audit-log",
      label: "Audit Log",
      description: "View and filter system activity logs",
      icon: ClipboardList,
    },
    {
      href: "/admin/sitemap",
      label: "Sitemap",
      description: "Manage XML sitemap configuration",
      icon: Map,
    },
    {
      href: "/admin/robots",
      label: "Robots.txt",
      description: "Configure robot exclusion rules",
      icon: Bot,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Advanced</h1>
        <p className="text-muted-foreground mt-2">Administrative tools and configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <Link key={option.href} href={option.href}>
              <Card className="cursor-pointer hover:border-primary/50 transition-colors h-full">
                <CardContent className="p-6 flex flex-col items-start gap-3">
                  <Icon className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">{option.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
