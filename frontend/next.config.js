/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com', 'placehold.co'],
    unoptimized: true, // Required for static export
  },
  output: 'export', // Enable static exports
  distDir: 'out',
  // Set base path to match your GitHub repository name (update this with your actual repo name)
  basePath: process.env.NODE_ENV === 'production' ? '/resq_connect' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/resq_connect/' : '',
  trailingSlash: true, // Recommended for GitHub Pages
}

module.exports = nextConfig 