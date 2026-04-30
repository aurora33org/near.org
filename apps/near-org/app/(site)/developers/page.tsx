import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: "For Developers | NEAR Protocol",
    description: "Start building on NEAR with comprehensive documentation, tools, and community.",
    openGraph: {
      title: "For Developers | NEAR Protocol",
      description: "Start building on NEAR with comprehensive documentation, tools, and community.",
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function Developers() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold mb-8">For Developers</h1>
      <p className="text-xl text-gray-600">
        Start building on NEAR with comprehensive documentation, tools, and community.
      </p>
    </div>
  );
}
