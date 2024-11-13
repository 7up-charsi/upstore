import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  images: {
    remotePatterns: [
      { hostname: 'cloud.appwrite.io' },
      { hostname: 'img.clerk.com' },
    ],
  },
};

export default nextConfig;
