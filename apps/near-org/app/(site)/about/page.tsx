import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: "About NEAR | NEAR Protocol",
    description: "NEAR Protocol is a blockchain that is simple to use, developer friendly, and carbon neutral. Learn about our mission and core values.",
    openGraph: {
      title: "About NEAR | NEAR Protocol",
      description: "NEAR Protocol is a blockchain that is simple to use, developer friendly, and carbon neutral.",
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold mb-8">About NEAR</h1>
      <div className="prose prose-lg">
        <p>
          NEAR Protocol is a blockchain that is simple to use, developer friendly,
          and carbon neutral. It uses Proof-of-Stake consensus and Sharding to achieve
          high performance and low costs.
        </p>
        <h2>Our Mission</h2>
        <p>
          To accelerate the world's transition to Web3 by making blockchain accessible
          to every person on the planet.
        </p>
        <h2>Core Values</h2>
        <ul>
          <li>Openness - Building transparent systems</li>
          <li>Usability - Making blockchain simple</li>
          <li>Sustainability - Caring for our planet</li>
        </ul>
      </div>
    </div>
  );
}
