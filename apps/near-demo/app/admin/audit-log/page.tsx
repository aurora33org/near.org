import Link from "next/link";
import { auth } from "@near/cms-core/lib/auth";
import { prisma } from "@near/cms-core/lib/prisma";
import { Badge } from "@near/cms-core/components/ui/badge";
import { Button } from "@near/cms-core/components/ui/button";
import { Card, CardContent } from "@near/cms-core/components/ui/card";
import { formatAdminDate } from "@near/cms-core/lib/utils";

const PAGE_SIZE = 50;
const VALID_ACTIONS = ["CREATE", "UPDATE", "DELETE"] as const;
const VALID_ENTITY_TYPES = ["POST", "MEDIA", "USER"] as const;
type AuditAction = (typeof VALID_ACTIONS)[number];
type AuditEntityType = (typeof VALID_ENTITY_TYPES)[number];

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; action?: string; entityType?: string; userEmail?: string; fromDate?: string; toDate?: string }>;
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

  const { page: pageParam, action: actionParam, entityType: entityTypeParam, userEmail: userEmailParam, fromDate: fromDateParam, toDate: toDateParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));
  const skip = (page - 1) * PAGE_SIZE;

  const where: any = {};
  if (actionParam && (VALID_ACTIONS as readonly string[]).includes(actionParam))
    where.action = actionParam as AuditAction;
  if (entityTypeParam && (VALID_ENTITY_TYPES as readonly string[]).includes(entityTypeParam))
    where.entityType = entityTypeParam as AuditEntityType;
  if (userEmailParam) where.userEmail = userEmailParam;

  // Date range filter
  const createdAtFilter: any = {};
  if (fromDateParam) {
    const fromDate = new Date(fromDateParam);
    if (!isNaN(fromDate.getTime())) {
      createdAtFilter.gte = fromDate;
    }
  }
  if (toDateParam) {
    const toDate = new Date(toDateParam);
    if (!isNaN(toDate.getTime())) {
      toDate.setHours(23, 59, 59, 999);
      createdAtFilter.lte = toDate;
    }
  }
  if (Object.keys(createdAtFilter).length > 0) {
    where.createdAt = createdAtFilter;
  }

  const hasFilters = !!(actionParam || entityTypeParam || userEmailParam || fromDateParam || toDateParam);

  const [logs, total, distinctUsers] = await Promise.all([
    (prisma as any).auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
    }),
    (prisma as any).auditLog.count({ where }),
    (prisma as any).auditLog.findMany({
      select: { userEmail: true },
      distinct: ["userEmail"],
      orderBy: { userEmail: "asc" },
    }),
  ]);

  // Verify which entities still exist to avoid broken links
  const postIds = new Set(logs.filter((log: any) => log.entityType === "POST").map((log: any) => log.entityId));
  const mediaIds = new Set(logs.filter((log: any) => log.entityType === "MEDIA").map((log: any) => log.entityId));

  const [existingPosts, existingMedia] = await Promise.all([
    postIds.size > 0
      ? (prisma as any).post.findMany({
          where: { id: { in: Array.from(postIds) } },
          select: { id: true },
        })
      : [],
    mediaIds.size > 0
      ? (prisma as any).media.findMany({
          where: { id: { in: Array.from(mediaIds) } },
          select: { id: true },
        })
      : [],
  ]);

  const validPostIds = new Set(existingPosts.map((p: any) => p.id));
  const validMediaIds = new Set(existingMedia.map((m: any) => m.id));

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function buildPageUrl(p: number) {
    const params = new URLSearchParams();
    if (actionParam) params.set("action", actionParam);
    if (entityTypeParam) params.set("entityType", entityTypeParam);
    if (userEmailParam) params.set("userEmail", userEmailParam);
    if (fromDateParam) params.set("fromDate", fromDateParam);
    if (toDateParam) params.set("toDate", toDateParam);
    params.set("page", String(p));
    return `/admin/audit-log?${params.toString()}`;
  }

  function buildExportUrl() {
    const params = new URLSearchParams();
    if (actionParam) params.set("action", actionParam);
    if (entityTypeParam) params.set("entityType", entityTypeParam);
    if (userEmailParam) params.set("userEmail", userEmailParam);
    if (fromDateParam) params.set("fromDate", fromDateParam);
    if (toDateParam) params.set("toDate", toDateParam);
    return `/api/audit-log/export?${params.toString()}`;
  }

  const actionBadgeVariant = (action: string) => {
    if (action === "CREATE") return "bg-green-500/10 text-green-600 border-green-300";
    if (action === "DELETE") return "bg-destructive/10 text-destructive border-destructive/30";
    return "bg-primary/10 text-primary border-primary/30";
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
        <select
          name="userEmail"
          defaultValue={userEmailParam ?? ""}
          className="border border-border rounded-[var(--radius)] px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All users</option>
          {distinctUsers.map((u: { userEmail: string }) => (
            <option key={u.userEmail} value={u.userEmail}>{u.userEmail}</option>
          ))}
        </select>

        <input
          type="date"
          name="fromDate"
          defaultValue={fromDateParam ?? ""}
          className="border border-border rounded-[var(--radius)] px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="From date"
        />
        <input
          type="date"
          name="toDate"
          defaultValue={toDateParam ?? ""}
          className="border border-border rounded-[var(--radius)] px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="To date"
        />

        <Button type="submit" variant="outline" size="sm">Filter</Button>
        {hasFilters && (
          <Link href="/admin/audit-log" className="text-sm text-muted-foreground hover:text-foreground transition">
            Clear
          </Link>
        )}

        {hasFilters && (
          <Button asChild variant="outline" size="sm">
            <a href={buildExportUrl()}>Export CSV</a>
          </Button>
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
                        {formatAdminDate(log.createdAt)}
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
                        {log.entityType === "POST" ? (
                          validPostIds.has(log.entityId) ? (
                            <Link
                              href={`/admin/posts/${log.entityId}/edit`}
                              className="hover:text-primary transition inline-flex items-center gap-1"
                            >
                              {log.entityTitle}
                              <span aria-hidden="true">↗</span>
                            </Link>
                          ) : (
                            <span className="text-muted-foreground line-through">{log.entityTitle}</span>
                          )
                        ) : log.entityType === "MEDIA" ? (
                          validMediaIds.has(log.entityId) ? (
                            <Link
                              href="/admin/media"
                              className="hover:text-primary transition inline-flex items-center gap-1"
                            >
                              {log.entityTitle}
                              <span aria-hidden="true">↗</span>
                            </Link>
                          ) : (
                            <span className="text-muted-foreground line-through">{log.entityTitle}</span>
                          )
                        ) : (
                          log.entityTitle
                        )}
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
