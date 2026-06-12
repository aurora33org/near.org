import { Feed } from "feed";
import { prisma } from "@near/cms-core/lib/prisma";
import { extractExcerpt } from "@near/cms-core/lib/excerpt";

export const revalidate = 3600;

export async function GET() {
  const baseUrl = "https://near.ai";

  const feed = new Feed({
    title: "NEAR AI Blog",
    description: "Insights on AI, private compute, and the future of the open web.",
    id: `${baseUrl}/blog`,
    link: `${baseUrl}/blog`,
    language: "en",
    feedLinks: { rss2: `${baseUrl}/feed.xml` },
    copyright: `© ${new Date().getFullYear()} NEAR AI`,
    author: { name: "NEAR AI", link: baseUrl },
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
      author: [{ name: post.author?.name ?? "NEAR AI" }],
      date: new Date(post.publishedAt!),
      category: post.categories.map((c: any) => ({ name: c.name })),
    });
  }

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
