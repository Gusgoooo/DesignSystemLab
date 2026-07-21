import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  assetPrefix: process.env.PUBLIC_PATH || undefined,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
