import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { NextConfig } from 'next'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  // 형제 디렉토리(alopedia, modu-web 등)의 lockfile 때문에 Next/Turbopack 이
  // workspace root 를 /Users/admin/Desktop 으로 잘못 추정하는 것을 방지.
  outputFileTracingRoot: __dirname,
  allowedDevOrigins: ['*.ngrok-free.app', '*.ngrok.app', '*.ngrok.io'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.modu.cloud',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn-dev.modudev.cloud',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'parking-cdn.socar.me',
        pathname: '/**'
      }
    ]
  },
  compiler: {
    removeConsole: process.env.APP_ENV === 'local' ? false : { exclude: ['error', 'warn'] }
  },
  turbopack: {
    root: __dirname,
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    }
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_MODU_API_HOST}/:path*`
      }
    ]
  },
  assetPrefix: process.env.NEXT_PUBLIC_STATIC_URL
}

export default nextConfig
