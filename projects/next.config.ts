import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  basePath: '/projects',
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/projects.html',
        destination: '/projects',
      },
    ]
  },
};

export default nextConfig;
