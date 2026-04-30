import React from "react";
import DOMPurify from "isomorphic-dompurify";
import { slugifyHeading } from "@cms/lib/extractHeadings";

interface TipTapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TipTapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
}

export interface RenderComponents {
  ImageComponent?: React.ComponentType<{
    src: string;
    alt: string;
    title?: string;
    className?: string;
  }>;
  CarouselComponent?: React.ComponentType<{
    images: Array<{ src: string; alt: string }>;
    slidesPerView?: number;
    aspectRatio?: string;
  }>;
}

function DefaultImage({ src, alt, title, className }: { src: string; alt: string; title?: string; className?: string }) {
  return <img src={src} alt={alt} title={title} className={className} />;
}

function DefaultCarousel({ images }: { images: Array<{ src: string; alt: string }> }) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {images.map((img, i) => <img key={i} src={img.src} alt={img.alt} />)}
    </div>
  );
}

function renderInlineContent(nodes: TipTapNode[] | undefined): React.ReactNode {
  if (!nodes) return null;

  return nodes.map((node, i) => {
    if (node.type === "hardBreak") {
      return <br key={i} />;
    }

    if (node.type === "text") {
      let el: React.ReactNode = node.text;

      const marks = node.marks ?? [];
      for (const mark of marks) {
        if (mark.type === "bold") el = <strong key={i}>{el}</strong>;
        else if (mark.type === "italic") el = <em key={i}>{el}</em>;
        else if (mark.type === "code") el = <code key={i}>{el}</code>;
        else if (mark.type === "strike") el = <s key={i}>{el}</s>;
        else if (mark.type === "underline") el = <u key={i}>{el}</u>;
        else if (mark.type === "textStyle")
          el = <span key={i} style={{ color: mark.attrs?.color }}>{el}</span>;
        else if (mark.type === "highlight")
          el = <mark key={i} style={{ backgroundColor: mark.attrs?.color }}>{el}</mark>;
        else if (mark.type === "link")
          el = (
            <a key={i} href={mark.attrs?.href} target={mark.attrs?.target ?? "_blank"} rel="noopener noreferrer">
              {el}
            </a>
          );
        else if (mark.type === "footnote")
          el = (
            <sup key={i} className="footnote-marker" data-footnote-id={mark.attrs?.id}>
              {el}
            </sup>
          );
      }

      return <React.Fragment key={i}>{el}</React.Fragment>;
    }

    return null;
  });
}

function getTextAlign(attrs?: Record<string, any>): React.CSSProperties | undefined {
  if (attrs?.textAlign && attrs.textAlign !== "left") {
    return { textAlign: attrs.textAlign };
  }
  return undefined;
}

export function renderBlocks(
  nodes: TipTapNode[] | undefined,
  components: RenderComponents = {}
): React.ReactNode {
  if (!nodes) return null;

  const Img = components.ImageComponent ?? DefaultImage;
  const Carousel = components.CarouselComponent ?? DefaultCarousel;

  return nodes.map((node, i) => {
    switch (node.type) {
      case "paragraph":
        return (
          <p key={i} style={getTextAlign(node.attrs)}>
            {renderInlineContent(node.content)}
          </p>
        );

      case "heading": {
        const level = node.attrs?.level ?? 2;
        const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
        const headingText = (node.content ?? []).map((c) => c.text ?? "").join("");
        const headingId = [2, 3].includes(level) ? slugifyHeading(headingText) : undefined;
        return (
          <Tag key={i} id={headingId} style={getTextAlign(node.attrs)}>
            {renderInlineContent(node.content)}
          </Tag>
        );
      }

      case "bulletList":
        return <ul key={i}>{renderBlocks(node.content, components)}</ul>;

      case "orderedList":
        return <ol key={i}>{renderBlocks(node.content, components)}</ol>;

      case "listItem":
        return <li key={i}>{renderBlocks(node.content, components)}</li>;

      case "taskList":
        return (
          <ul key={i} className="not-prose space-y-1 list-none pl-0">
            {renderBlocks(node.content, components)}
          </ul>
        );

      case "taskItem": {
        const checked = node.attrs?.checked ?? false;
        return (
          <li key={i} className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={checked}
              readOnly
              className="mt-1 rounded border-gray-300"
            />
            <div className={checked ? "line-through text-muted-foreground" : ""}>
              {renderBlocks(node.content, components)}
            </div>
          </li>
        );
      }

      case "codeBlock": {
        const lang = node.attrs?.language;
        const text = node.content?.[0]?.text ?? "";
        return (
          <pre key={i}>
            <code className={lang ? `language-${lang}` : undefined}>{text}</code>
          </pre>
        );
      }

      case "blockquote":
        return <blockquote key={i}>{renderBlocks(node.content, components)}</blockquote>;

      case "horizontalRule":
        return <hr key={i} />;

      case "hardBreak":
        return <br key={i} />;

      case "image":
        return (
          <Img
            key={i}
            src={node.attrs?.src}
            alt={node.attrs?.alt ?? ""}
            title={node.attrs?.title}
            className="rounded-lg max-w-full"
          />
        );

      case "carousel": {
        const images = (() => {
          try {
            return JSON.parse(node.attrs?.images || "[]");
          } catch {
            return [];
          }
        })();
        return (
          <Carousel
            key={i}
            images={images}
            slidesPerView={node.attrs?.slidesPerView ?? 1}
            aspectRatio={node.attrs?.aspectRatio ?? "auto"}
          />
        );
      }

      case "embedBlock": {
        const url = node.attrs?.url;
        if (!url) return null;

        const getEmbedUrl = (sourceUrl: string) => {
          if (sourceUrl.includes("youtube.com") || sourceUrl.includes("youtu.be")) {
            const videoId = sourceUrl.includes("youtu.be")
              ? sourceUrl.split("youtu.be/")[1]?.split("?")[0]
              : sourceUrl.split("v=")[1]?.split("&")[0];
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
          }
          if (sourceUrl.includes("vimeo.com")) {
            const videoId = sourceUrl.split("vimeo.com/")[1]?.split("?")[0];
            return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
          }
          return sourceUrl;
        };

        const embedUrl = getEmbedUrl(url);
        if (!embedUrl) return null;

        return (
          <div key={i} className="my-6 aspect-video rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        );
      }

      case "table": {
        const rows = node.content ?? [];
        const headerRows: TipTapNode[] = [];
        const bodyRows: TipTapNode[] = [];

        for (const row of rows) {
          const cells = row.content ?? [];
          const hasHeaderCell = cells.some(cell => cell.type === "tableHeader");
          if (hasHeaderCell) {
            headerRows.push(row);
          } else {
            bodyRows.push(row);
          }
        }

        return (
          <div key={i} className="overflow-x-auto my-4 rounded-lg border border-border">
            <table className="w-full border-collapse border border-border">
              {headerRows.length > 0 && (
                <thead>{renderBlocks(headerRows, components)}</thead>
              )}
              {bodyRows.length > 0 && (
                <tbody>{renderBlocks(bodyRows, components)}</tbody>
              )}
            </table>
          </div>
        );
      }

      case "tableRow":
        return <tr key={i}>{renderBlocks(node.content, components)}</tr>;

      case "tableHeader":
        return (
          <th
            key={i}
            className="border border-border bg-muted px-4 py-2 text-left font-semibold"
            colSpan={node.attrs?.colspan}
            rowSpan={node.attrs?.rowspan}
          >
            {renderBlocks(node.content, components)}
          </th>
        );

      case "tableCell":
        return (
          <td
            key={i}
            className="border border-border px-4 py-2"
            colSpan={node.attrs?.colspan}
            rowSpan={node.attrs?.rowspan}
          >
            {renderBlocks(node.content, components)}
          </td>
        );

      case "rawHtmlBlock": {
        const cleanHtml = DOMPurify.sanitize(node.attrs?.content ?? "", {
          FORBID_TAGS: ["form", "input", "button", "select", "textarea", "base", "meta"],
          FORBID_ATTR: ["style"],
        });
        return (
          <div
            key={i}
            className="raw-html-block my-4"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        );
      }

      case "columnLayout": {
        const cols = node.attrs?.columns ?? 2;
        const widths = node.attrs?.widths || [];
        const collapseAt = node.attrs?.collapseAt ?? "md";

        const gridClass =
          cols === 1 ? "grid-cols-1" :
          cols === 2 ? `grid-cols-1 ${collapseAt}:grid-cols-2` :
          cols === 3 ? `grid-cols-1 ${collapseAt}:grid-cols-3` :
          cols === 4 ? `grid-cols-1 ${collapseAt}:grid-cols-4` :
          `grid-cols-1`;

        const style = widths.length === cols
          ? { gridTemplateColumns: widths.map((w: number) => `${w}fr`).join(" ") }
          : undefined;

        return (
          <div
            key={i}
            className={`my-4 grid gap-6 ${gridClass}`}
            style={style}
          >
            {renderBlocks(node.content, components)}
          </div>
        );
      }

      case "column":
        return <div key={i}>{renderBlocks(node.content, components)}</div>;

      case "callout": {
        const calloutType = node.attrs?.type ?? "info";
        const calloutStyles: Record<string, { bg: string; border: string; icon: string }> = {
          info: { bg: "bg-blue-50 dark:bg-blue-950", border: "border-blue-200 dark:border-blue-800", icon: "ℹ️" },
          warning: { bg: "bg-yellow-50 dark:bg-yellow-950", border: "border-yellow-200 dark:border-yellow-800", icon: "⚠️" },
          success: { bg: "bg-green-50 dark:bg-green-950", border: "border-green-200 dark:border-green-800", icon: "✓" },
          error: { bg: "bg-red-50 dark:bg-red-950", border: "border-red-200 dark:border-red-800", icon: "✕" },
        };

        const style = calloutStyles[calloutType] || calloutStyles.info;

        return (
          <div
            key={i}
            className={`rounded-lg border-2 ${style.bg} ${style.border} p-4 my-4`}
          >
            <div className="prose dark:prose-invert max-w-none">
              {renderBlocks(node.content, components)}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  });
}
