import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@cms/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  // Verify Vercel Cron secret
  const authHeader = req.headers.get("Authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    // Find posts that were published in the last 2 minutes
    // This prevents re-revalidating the same posts on every cron tick
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

    const scheduledPosts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          lte: now,
          gte: twoMinutesAgo,
        },
      },
      select: { slug: true },
    });

    if (scheduledPosts.length > 0) {
      // Revalidate blog pages
      revalidatePath("/blog");
      revalidatePath("/feed.xml");
      revalidatePath("/sitemap.xml");

      // Revalidate individual post pages
      for (const post of scheduledPosts) {
        revalidatePath(`/blog/${post.slug}`);
      }
    }

    return NextResponse.json({
      success: true,
      revalidated: scheduledPosts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      { error: "Cron job failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
