import React from "react";

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

export function renderBlocks(nodes: TipTapNode[] | undefined): React.ReactNode {
  if (!nodes) return null;

  return nodes.map((node, i) => {
    switch (node.type) {
      case "paragraph":
        return <p key={i}>{renderInlineContent(node.content)}</p>;

      case "heading": {
        const level = node.attrs?.level ?? 2;
        const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
        return <Tag key={i}>{renderInlineContent(node.content)}</Tag>;
      }

      case "bulletList":
        return <ul key={i}>{renderBlocks(node.content)}</ul>;

      case "orderedList":
        return <ol key={i}>{renderBlocks(node.content)}</ol>;

      case "listItem":
        return <li key={i}>{renderBlocks(node.content)}</li>;

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

      default:
        return null;
    }
  });
}
