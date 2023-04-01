/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/github/:path*',
        destination: 'https://github.com/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'https://api.github.com/:path*',
      }
    ]
  },
}

module.exports = nextConfig
