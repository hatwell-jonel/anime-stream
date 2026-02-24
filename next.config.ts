import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["aniwatch", "pino", "thread-stream"],
};

export default nextConfig;
