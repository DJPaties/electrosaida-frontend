import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    eslint: {
    ignoreDuringBuilds: true,
  },
  images:{
    domains:['localhost','192.168.2.19']
  }
};

export default nextConfig;
