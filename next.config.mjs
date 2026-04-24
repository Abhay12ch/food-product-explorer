/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.openfoodfacts.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.openfoodfacts.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "world.openfoodfacts.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
