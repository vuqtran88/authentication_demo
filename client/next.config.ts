import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    AUTH_SERVER_URL: process.env.AUTH_SERVER_URL,
    PORT: process.env.PORT,
  },
};

export default nextConfig;
