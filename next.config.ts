import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
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
