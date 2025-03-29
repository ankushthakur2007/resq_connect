/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/resq_connect', // Match your repo name
  assetPrefix: '/resq_connect/', // Match your repo name with trailing slash
};

module.exports = nextConfig;
