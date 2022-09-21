/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://newness.net/rest/:path*',
      },
    ]
  },
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    domains: ['localhost', 'newness.net'],
  },
}

module.exports = nextConfig
