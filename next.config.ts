import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  allowedDevOrigins: [
    "192.168.1.124",
    "192.168.1.*",
    "localhost:3000",
    "127.0.0.1:3000",
  ],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "gsap"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
