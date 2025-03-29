/** @type {import('next').NextConfig} */
const nextConfig = {
  // Comment out static export to enable API routes and middleware
  // output: 'export',
  images: {
    unoptimized: true,
  },
  // Make basePath conditional based on NODE_ENV
  basePath: process.env.NODE_ENV === 'production' ? '/resq_connect' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/resq_connect/' : '',
  // Add trailingSlash for GitHub Pages compatibility
  trailingSlash: true,
};

module.exports = nextConfig;
