import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // Next 16 treats some NAT64 CDN lookups as private IPs and 400s the optimizer.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
  async redirects() {
    return [
      {
        source: "/project",
        destination: "/about",
        permanent: false,
      },
      {
        source: "/snapshot",
        destination: "/about",
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
