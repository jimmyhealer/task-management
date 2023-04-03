/** @type {import('next').NextConfig} */
require('dotenv').config()

const nextConfig = {
  reactStrictMode: false,
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
  },
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
