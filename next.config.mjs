import { hostname } from "os";

const nextConfig = {
  // reactStrictMode: true,
  // productionBrowserSourceMaps: true,

  images: {
    // only images from https://images.unsplash.com are allowed.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol:'https',
        hostname:'utfs.io'
      }
    ],
  },
};

export default nextConfig;
