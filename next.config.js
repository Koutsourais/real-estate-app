/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Βάλε εδώ τα domains από τα οποία φορτώνεις εικόνες
    // (WP media host σου κ.λπ.)
    domains: ["koutsourais.com"],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
