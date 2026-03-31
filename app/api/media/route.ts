import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 24;

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const skip = (page - 1) * PAGE_SIZE;
  const q = url.searchParams.get("q")?.trim() || undefined;
  const typeParam = url.searchParams.get("type");

  let mimeFilter: object = {};
  if (typeParam === "image") mimeFilter = { mimeType: { startsWith: "image/" } };
  else if (typeParam === "other") mimeFilter = { NOT: { mimeType: { startsWith: "image/" } } };

  const where = {
    ...(q && { filename: { contains: q, mode: "insensitive" as const } }),
    ...mimeFilter,
  };

  const [items, total] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
    }),
    prisma.media.count({ where }),
  ]);

  return NextResponse.json({ items, total, page });
}
