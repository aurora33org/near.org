export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractHeadings(doc: any): Heading[] {
  return (doc?.content ?? [])
    .filter((n: any) => n.type === "heading" && [2, 3].includes(n.attrs?.level))
    .map((n: any) => {
      const text = (n.content ?? []).map((c: any) => c.text ?? "").join("");
      return { id: slugifyHeading(text), text, level: n.attrs.level };
    });
}
