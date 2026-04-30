import type { NextConfig } from "next";

function getTrustedImageHostnames(): { protocol: "https"; hostname: string }[] {
  const patterns: { protocol: "https"; hostname: string }[] = [];
  if (process.env.R2_PUBLIC_URL) {
    try {
      const { hostname } = new URL(process.env.R2_PUBLIC_URL);
      patterns.push({ protocol: "https", hostname });
    } catch {}
  }
  if (process.env.S3_ENDPOINT) {
    try {
      const { hostname } = new URL(process.env.S3_ENDPOINT);
      patterns.push({ protocol: "https", hostname });
    } catch {}
  }
  return patterns.length > 0 ? patterns : [];
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@near/cms-core"],
  images: {
    remotePatterns: getTrustedImageHostnames(),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};

export default nextConfig;
