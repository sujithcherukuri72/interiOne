import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder photography only — swap for real studio shoots once delivered.
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
