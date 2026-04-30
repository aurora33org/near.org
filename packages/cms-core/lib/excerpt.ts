export function extractExcerpt(content: any, maxLength = 160): string {
  if (!content) return "";

  function extractText(node: any): string {
    if (node.type === "text") return node.text ?? "";
    if (!node.content) return "";
    return node.content.map(extractText).join("");
  }

  const raw = (content.content ?? [])
    .map(extractText)
    .join(" ")
    .trim()
    .replace(/\s+/g, " ");

  return raw.length > maxLength ? raw.slice(0, maxLength).trimEnd() + "…" : raw;
}
