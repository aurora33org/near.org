import { prisma } from "@/lib/prisma";

export const revalidate = 60;

const BASE_URL = "https://near.org";

export default async function sitemap() {
  let posts: { slug: string; updatedAt: Date }[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    // DB not available at build time — return only static routes
  }

  const staticRoutes = [
    "/",
    "/blog",
    "/about",
    "/founders",
    "/developers",
    "/tech",
    "/community",
    "/ecosystem",
  ].map((url) => ({
    url: `${BASE_URL}${url}`,
    lastModified: new Date(),
  }));

  const postRoutes = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [...staticRoutes, ...postRoutes];
}
