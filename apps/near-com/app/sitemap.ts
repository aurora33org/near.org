import { MetadataRoute } from "next";
import { prisma } from "@near/cms-core/lib/prisma";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://near.com";
  let posts: { slug: string; publishedAt: Date | null; updatedAt: Date }[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { status: "PUBLISHED", publishedAt: { lte: new Date() }, excludeFromSitemap: false },
      select: { slug: true, publishedAt: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch {}

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...posts.map((post) => ({ url: `${baseUrl}/blog/${post.slug}`, lastModified: post.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
