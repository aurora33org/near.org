import { renderBlocks } from "@cms/lib/tiptap-renderer";
import { readingTime } from "@cms/lib/readingTime";

interface AdminPostRendererProps {
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
}

export default function AdminPostRenderer({ post }: AdminPostRendererProps) {
  const content = post.content as any;
  const readTime = readingTime(content);

  const heroStyle: React.CSSProperties = post.heroBgImage
    ? { backgroundImage: `url(${post.heroBgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : post.heroBgColor
      ? { backgroundColor: post.heroBgColor }
      : {};

  const textColorClass = post.heroBgImage ? "text-white" : "text-foreground";

  return (
    <>
      <div style={heroStyle}>
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className={`text-sm ${textColorClass} opacity-70`}>Blog</span>
            <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">DRAFT</span>
          </div>
          <h1 className={`text-5xl font-bold mb-4 ${textColorClass}`}>{post.title}</h1>
          <p className={`text-sm ${textColorClass} opacity-70 mb-8`}>
            {new Date(post.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            {" (last updated)"} · {readTime}
          </p>
          {post.coverImage && (
            <img src={post.coverImage} alt={post.title} className="w-full rounded-lg object-cover" width={800} height={400} />
          )}
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          {renderBlocks(content?.content ?? [])}
        </div>
      </div>
    </>
  );
}
