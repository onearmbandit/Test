/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
        port: "",
        pathname: "/*",
      },
    ],
  },
};

module.exports = nextConfig;
