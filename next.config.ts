import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
