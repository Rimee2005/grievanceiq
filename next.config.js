/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
    // Keep domains for backwards compatibility (deprecated in Next.js 13+)
    domains: ['res.cloudinary.com', 'localhost'],
    // Allow unoptimized images (for base64 data URLs and external images)
    unoptimized: false,
  },
}

module.exports = nextConfig

