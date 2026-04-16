import Link from "next/link";
import { renderBlocks } from "@/lib/tiptap-renderer";
import { readingTime } from "@/lib/readingTime";

interface PostRendererProps {
  post: {
    id: string;
    title: string;
    slug: string;
    coverImage?: string | null;
    heroBgColor?: string | null;
    heroBgImage?: string | null;
    content: any;
    publishedAt?: Date | null;
    updatedAt: Date;
    author: {
      name: string;
    };
    categories: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  showCategoryLinks?: boolean;
  showAuthor?: boolean;
  layout?: "admin" | "public";
}

export default function PostRenderer({
  post,
  showCategoryLinks = true,
  showAuthor = true,
  layout = "public",
}: PostRendererProps) {
  const content = post.content as any;
  const displayDate = layout === "admin" ? post.updatedAt : post.publishedAt || post.updatedAt;
  const readTime = readingTime(content);

  const heroStyle: React.CSSProperties = post.heroBgImage
    ? {
        backgroundImage: `url(${post.heroBgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : post.heroBgColor
      ? { backgroundColor: post.heroBgColor }
      : {};

  // Determine text color based on whether there's a background image (assume dark)
  const textColorClass = post.heroBgImage ? "text-white" : "text-foreground";

  return (
    <>
      {/* HERO */}
      <div style={heroStyle}>
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-12">
          {layout === "public" ? (
            <Link href="/blog" className={`text-sm ${textColorClass} opacity-70 hover:opacity-100 mb-6 block transition`}>
              Blog
            </Link>
          ) : (
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-sm ${textColorClass} opacity-70`}>Blog</span>
              <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">
                DRAFT
              </span>
            </div>
          )}

          <h1 className={`text-5xl font-bold mb-4 ${textColorClass}`}>{post.title}</h1>

          {showCategoryLinks && layout === "public" && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog/category/${cat.slug}`}
                  className="text-xs bg-opacity-20 bg-blue-500 text-blue-700 px-2 py-1 rounded hover:bg-opacity-30 transition"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          <p className={`text-sm ${textColorClass} opacity-70 mb-8`}>
            {new Date(displayDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {layout === "admin" ? " (last updated)" : ""}
            {showAuthor && layout === "public" && (
              <>
                {" "}· {post.author.name} · {readTime}
              </>
            )}
          </p>

          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full rounded-lg object-cover"
              width={800}
              height={400}
              priority
            />
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          {renderBlocks(content?.content ?? [])}
        </div>
      </div>
    </>
  );
}
