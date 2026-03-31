import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PAGE_SIZE = 50;
const VALID_ACTIONS = ["CREATE", "UPDATE", "DELETE"] as const;
const VALID_ENTITY_TYPES = ["POST", "MEDIA", "USER"] as const;
type AuditAction = (typeof VALID_ACTIONS)[number];
type AuditEntityType = (typeof VALID_ENTITY_TYPES)[number];

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; action?: string; entityType?: string }>;
}) {
  const session = await auth();
  const userRole = (session?.user as any)?.role;

  if (userRole !== "ADMIN") {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">You don&apos;t have permission to access this page.</p>
      </div>
    );
  }

  const { page: pageParam, action: actionParam, entityType: entityTypeParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));
  const skip = (page - 1) * PAGE_SIZE;

  const where: any = {};
  if (actionParam && (VALID_ACTIONS as readonly string[]).includes(actionParam))
    where.action = actionParam as AuditAction;
  if (entityTypeParam && (VALID_ENTITY_TYPES as readonly string[]).includes(entityTypeParam))
    where.entityType = entityTypeParam as AuditEntityType;

  const hasFilters = !!(actionParam || entityTypeParam);

  const [logs, total] = await Promise.all([
    (prisma as any).auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
    }),
    (prisma as any).auditLog.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function buildPageUrl(p: number) {
    const params = new URLSearchParams();
    if (actionParam) params.set("action", actionParam);
    if (entityTypeParam) params.set("entityType", entityTypeParam);
    params.set("page", String(p));
    return `/admin/audit-log?${params.toString()}`;
  }

  const actionBadgeVariant = (action: string) => {
    if (action === "CREATE") return "bg-green-500/10 text-green-600 border-green-300";
    if (action === "DELETE") return "bg-destructive/10 text-destructive border-destructive/30";
    return "bg-blue-500/10 text-blue-600 border-blue-300";
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Audit Log</h1>

      {/* Filters */}
      <form method="GET" className="flex items-center gap-3 flex-wrap">
        <select
          name="action"
          defaultValue={actionParam ?? ""}
          className="border border-border rounded-[var(--radius)] px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All actions</option>
          {VALID_ACTIONS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select
          name="entityType"
          defaultValue={entityTypeParam ?? ""}
          className="border border-border rounded-[var(--radius)] px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All types</option>
          {VALID_ENTITY_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <Button type="submit" variant="outline" size="sm">Filter</Button>
        {hasFilters && (
          <Link href="/admin/audit-log" className="text-sm text-muted-foreground hover:text-foreground transition">
            Clear
          </Link>
        )}
        <p className="ml-auto text-sm text-muted-foreground">{total} events</p>
      </form>

      <Card>
        {logs.length === 0 ? (
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">No audit events found.</p>
          </CardContent>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-6 py-3 text-left font-medium text-sm">Timestamp</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">User</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Action</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Type</th>
                    <th className="px-6 py-3 text-left font-medium text-sm">Entity</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-muted/20 transition">
                      <td className="px-6 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-sm">{log.userEmail}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${actionBadgeVariant(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <Badge variant="outline" className="text-xs">{log.entityType}</Badge>
                      </td>
                      <td className="px-6 py-3 text-sm max-w-xs truncate" title={log.entityTitle}>
                        {log.entityTitle}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={buildPageUrl(page - 1)}>← Previous</Link>
                    </Button>
                  )}
                  {page < totalPages && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={buildPageUrl(page + 1)}>Next →</Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
