import { Feed } from "feed";
import { prisma } from "@/lib/prisma";
import { extractExcerpt } from "@/lib/excerpt";

export const revalidate = 60;

const BASE_URL = "https://near.org";

export async function GET() {
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: "desc" },
      take: 20,
      include: { author: true },
    });
  } catch {
    // DB not available — return empty feed
  }

  const feed = new Feed({
    title: "NEAR Protocol Blog",
    description: "Latest news and updates from NEAR Protocol",
    id: `${BASE_URL}/`,
    link: `${BASE_URL}/`,
    feedLinks: { rss2: `${BASE_URL}/feed.xml` },
    author: { name: "NEAR Protocol", email: "hello@near.org" },
    copyright: `© ${new Date().getFullYear()} NEAR Protocol`,
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${BASE_URL}/blog/${post.slug}`,
      link: `${BASE_URL}/blog/${post.slug}`,
      description: post.excerpt || extractExcerpt(post.content, 300),
      date: post.publishedAt ?? post.createdAt,
      author: [{ name: post.author.name ?? post.author.email }],
      image: post.coverImage ?? undefined,
    });
  }

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
