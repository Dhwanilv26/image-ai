const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,

  eslint: {
    ignoreDuringBuilds: true,
  },
  distDir: '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
  },
};

export default nextConfig;
