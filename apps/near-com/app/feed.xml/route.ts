import { Feed } from "feed";
import { prisma } from "@near/cms-core/lib/prisma";
import { extractExcerpt } from "@near/cms-core/lib/excerpt";

export const revalidate = 3600;

export async function GET() {
  const baseUrl = "https://near.com";
  const feed = new Feed({
    title: "NEAR Blog",
    description: "News, ecosystem updates, and insights from NEAR.",
    id: `${baseUrl}/blog`,
    link: `${baseUrl}/blog`,
    language: "en",
    feedLinks: { rss2: `${baseUrl}/feed.xml` },
    copyright: `© ${new Date().getFullYear()} NEAR`,
    author: { name: "NEAR", link: baseUrl },
  });

  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: "desc" },
      take: 20,
      include: { author: true, categories: true },
    });
  } catch {}

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${baseUrl}/blog/${post.slug}`,
      link: `${baseUrl}/blog/${post.slug}`,
      description: post.excerpt || extractExcerpt(post.content),
      author: [{ name: post.author?.name ?? "NEAR" }],
      date: new Date(post.publishedAt!),
      category: post.categories.map((c: any) => ({ name: c.name })),
    });
  }

  return new Response(feed.rss2(), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
