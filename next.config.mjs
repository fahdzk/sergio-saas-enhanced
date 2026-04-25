/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Existing codebase has non-blocking lint debt; don't fail production builds.
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;
