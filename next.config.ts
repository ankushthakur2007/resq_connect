/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/resq_connect',
  assetPrefix: '/resq_connect/',
  // Add trailingSlash for GitHub Pages compatibility
  trailingSlash: true,
};

module.exports = nextConfig;
