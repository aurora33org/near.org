import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function BlogIndex() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 20,
    include: { author: true },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold mb-12">Blog</h1>

      <div className="space-y-8">
        {posts.length === 0 ? (
          <p className="text-gray-600">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="border-b pb-8 last:border-b-0"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold hover:text-gray-600 cursor-pointer mb-2">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 mb-4">
                {new Date(post.publishedAt!).toLocaleDateString()} •{" "}
                {post.author.name}
              </p>
              {post.excerpt && (
                <p className="text-gray-700 mb-4">{post.excerpt}</p>
              )}
              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-600 hover:underline font-medium"
              >
                Read more →
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
