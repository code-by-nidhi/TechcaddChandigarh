import type { NextConfig } from "next";

/**
 * Where CMS-uploaded images come from.
 *
 * The API returns absolute URLs for `/uploads/…` because it is on a different
 * origin from this site, and `next/image` refuses a remote host it has not been
 * told about. Derived from `CMS_API_URL` rather than hard-coded so localhost and
 * production need no separate entry — and so a deployment that moves the CMS
 * does not silently lose every gallery photo.
 */
function cmsImagePattern() {
  const base = process.env.CMS_API_URL;
  if (!base) return [];

  try {
    const { protocol, hostname, port } = new URL(base);
    return [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        port,
        pathname: "/uploads/**",
      },
    ];
  } catch {
    // A malformed CMS_API_URL is already fatal for every CMS read; it must not
    // also stop the build here.
    return [];
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: cmsImagePattern(),
  },
};

export default nextConfig;
