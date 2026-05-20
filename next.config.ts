import type { NextConfig } from 'next'

// pnpm script 는 항상 package.json 위치에서 실행되므로 process.cwd() === trace 루트.
// 형제 디렉토리(alopedia, modu-web)의 lockfile 때문에 Next/Turbopack 이
// workspace root 를 한 단계 위(/Users/admin/Desktop)로 잘못 추정하는 것을 방지.
const projectRoot = process.cwd()

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
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
    root: projectRoot,
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
