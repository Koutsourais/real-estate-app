/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["koutsourais.com"],
  },
  reactStrictMode: true,

  async redirects() {
    if (process.env.UNDER_CONSTRUCTION === "true") {
      return [
        {
          source: "/((?!under-construction).*)", // όλα εκτός της UC σελίδας
          destination: "/under-construction",
          permanent: false,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
