import Link from "next/link";
import { renderBlocks, RenderComponents } from "@near/cms-core/lib/tiptap-renderer";
import { readingTime } from "@near/cms-core/lib/readingTime";

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
    author: { name: string };
    categories: Array<{ id: string; name: string; slug: string }>;
  };
  layout?: "admin" | "public";
}

const components: RenderComponents = {};

export default function PostRenderer({ post, layout = "public" }: PostRendererProps) {
  const content = post.content as any;
  const displayDate = layout === "admin" ? post.updatedAt : post.publishedAt || post.updatedAt;
  const readTime = readingTime(content);

  const heroStyle: React.CSSProperties = post.heroBgImage
    ? { backgroundImage: `url(${post.heroBgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : post.heroBgColor
      ? { backgroundColor: post.heroBgColor }
      : { background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a855f7 100%)" };

  const textColorClass = "text-white";

  return (
    <>
      {/* HERO */}
      <div style={heroStyle}>
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-12">
          {layout === "public" ? (
            <div className={`text-sm ${textColorClass} opacity-70 mb-6 flex items-center gap-1`}>
              <Link href="/blog" className="hover:opacity-100 transition">Blog</Link>
              {post.categories.length > 0 && (
                <>
                  <span className="opacity-40">›</span>
                  <Link href={`/blog/category/${post.categories[0].slug}`} className="hover:opacity-100 transition">
                    {post.categories[0].name}
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-sm ${textColorClass} opacity-70`}>Blog</span>
              <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">DRAFT</span>
            </div>
          )}
          <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${textColorClass} leading-tight`}>{post.title}</h1>
          <p className={`text-sm ${textColorClass} opacity-70 mb-8`}>
            {new Date(displayDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            {layout === "admin" ? " (last updated)" : ` · ${readTime}`}
            {" · "}{post.author.name}
          </p>
          {post.coverImage && (
            <img src={post.coverImage} alt={post.title} className="w-full rounded-xl object-cover" />
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose prose-lg prose-purple max-w-none">
          {renderBlocks(content?.content ?? [], components)}
        </div>
      </div>
    </>
  );
}
