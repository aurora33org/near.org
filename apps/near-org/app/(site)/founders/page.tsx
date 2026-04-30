import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: "For Founders | NEAR Protocol",
    description: "Build your Web3 company on NEAR. Get funding, mentorship, and community support.",
    openGraph: {
      title: "For Founders | NEAR Protocol",
      description: "Build your Web3 company on NEAR. Get funding, mentorship, and community support.",
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function Founders() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold mb-8">For Founders</h1>
      <p className="text-xl text-gray-600">
        Build your Web3 company on NEAR. Get funding, mentorship, and community support.
      </p>
    </div>
  );
}
