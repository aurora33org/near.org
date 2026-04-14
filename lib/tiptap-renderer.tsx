import React from "react";
import DOMPurify from "isomorphic-dompurify";
import { slugifyHeading } from "@/lib/extractHeadings";
import { BlogCarousel } from "@/components/blog/BlogCarousel";

interface TipTapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TipTapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
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
        else if (mark.type === "link")
          el = (
            <a key={i} href={mark.attrs?.href} target={mark.attrs?.target ?? "_blank"} rel="noopener noreferrer">
              {el}
            </a>
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

export function renderBlocks(nodes: TipTapNode[] | undefined): React.ReactNode {
  if (!nodes) return null;

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
        return <ul key={i}>{renderBlocks(node.content)}</ul>;

      case "orderedList":
        return <ol key={i}>{renderBlocks(node.content)}</ol>;

      case "listItem":
        return <li key={i}>{renderBlocks(node.content)}</li>;

      case "taskList":
        return (
          <ul key={i} className="not-prose space-y-1 list-none pl-0">
            {renderBlocks(node.content)}
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
              {renderBlocks(node.content)}
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
        return <blockquote key={i}>{renderBlocks(node.content)}</blockquote>;

      case "horizontalRule":
        return <hr key={i} />;

      case "hardBreak":
        return <br key={i} />;

      case "image":
        return (
          <img
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
        const slidesPerView = node.attrs?.slidesPerView ?? 1;
        return <BlogCarousel key={i} images={images} slidesPerView={slidesPerView} />;
      }

      // Table support
      case "table":
        return (
          <div key={i} className="overflow-x-auto my-4">
            <table className="w-full border-collapse border border-border">
              <tbody>{renderBlocks(node.content)}</tbody>
            </table>
          </div>
        );

      case "tableRow":
        return <tr key={i}>{renderBlocks(node.content)}</tr>;

      case "tableHeader":
        return (
          <th
            key={i}
            className="border border-border bg-muted px-4 py-2 text-left font-semibold"
            colSpan={node.attrs?.colspan}
            rowSpan={node.attrs?.rowspan}
          >
            {renderBlocks(node.content)}
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
            {renderBlocks(node.content)}
          </td>
        );

      // Raw HTML block
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

      // Column layout
      case "columnLayout": {
        const cols = node.attrs?.columns ?? 2;
        return (
          <div
            key={i}
            className="my-4"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: "1.5rem",
            }}
          >
            {renderBlocks(node.content)}
          </div>
        );
      }

      case "column":
        return <div key={i}>{renderBlocks(node.content)}</div>;

      default:
        return null;
    }
  });
}
