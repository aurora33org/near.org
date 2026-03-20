import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: "Tech Stack | NEAR Protocol",
    description: "Learn about NEAR's innovative technology architecture.",
    openGraph: {
      title: "Tech Stack | NEAR Protocol",
      description: "Learn about NEAR's innovative technology architecture.",
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function Tech() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold mb-8">Tech Stack</h1>
      <p className="text-xl text-gray-600">
        Learn about NEAR's innovative technology architecture.
      </p>
    </div>
  );
}
