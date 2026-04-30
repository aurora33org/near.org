import { auth } from "@near/cms-core/lib/auth";
import { prisma } from "@near/cms-core/lib/prisma";

const VALID_ACTIONS = ["CREATE", "UPDATE", "DELETE"] as const;
const VALID_ENTITY_TYPES = ["POST", "MEDIA", "USER"] as const;
type AuditAction = (typeof VALID_ACTIONS)[number];
type AuditEntityType = (typeof VALID_ENTITY_TYPES)[number];

export async function GET(request: Request) {
  const session = await auth();
  const userRole = (session?.user as any)?.role;

  // Only admins can export audit logs
  if (userRole !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const actionParam = searchParams.get("action");
  const entityTypeParam = searchParams.get("entityType");
  const userEmailParam = searchParams.get("userEmail");
  const fromDateParam = searchParams.get("fromDate");
  const toDateParam = searchParams.get("toDate");

  const where: any = {};
  if (actionParam && (VALID_ACTIONS as readonly string[]).includes(actionParam)) {
    where.action = actionParam as AuditAction;
  }
  if (entityTypeParam && (VALID_ENTITY_TYPES as readonly string[]).includes(entityTypeParam)) {
    where.entityType = entityTypeParam as AuditEntityType;
  }
  if (userEmailParam) {
    where.userEmail = userEmailParam;
  }

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

  try {
    // Fetch all matching logs (no pagination for export)
    const logs = await (prisma as any).auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Build CSV content
    const headers = ["Timestamp", "User Email", "Action", "Entity Type", "Entity ID", "Entity Title"];
    const rows = logs.map((log: any) => [
      new Date(log.createdAt).toISOString(),
      log.userEmail,
      log.action,
      log.entityType,
      log.entityId,
      log.entityTitle,
    ]);

    // Format as CSV
    const csv = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((row: (string | number)[]) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    // Return with attachment headers
    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="audit-log-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Audit log export error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
