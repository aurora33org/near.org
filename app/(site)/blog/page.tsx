import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function BlogIndex() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 20,
    include: { author: true },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold mb-12">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-gray-600">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <Link href={`/blog/${post.slug}`} className="block">
                {post.coverImage ? (
                  <div className="relative aspect-video w-full bg-gray-100">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-300 text-4xl">✦</span>
                  </div>
                )}
              </Link>

              <div className="flex flex-col flex-1 p-5">
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(post.publishedAt!).toLocaleDateString()} · {post.author.name}
                </p>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-lg font-bold leading-snug hover:text-gray-600 mb-2">
                    {post.title}
                  </h2>
                </Link>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm line-clamp-3 flex-1">{post.excerpt}</p>
                )}
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 text-sm text-blue-600 hover:underline font-medium"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
