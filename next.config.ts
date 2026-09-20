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
      {
        source: "/projects/worklist",
        destination: "/projects/worklist/part1",
        permanent: true,
      },
      {
        source: "/projects/worklist/overview",
        destination: "/projects/worklist/part1",
        permanent: true,
      },
      {
        source: "/projects/viewer",
        destination: "/projects/viewer/part1",
        permanent: true,
      },
      {
        source: "/projects/viewer/overview",
        destination: "/projects/viewer/part1",
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
