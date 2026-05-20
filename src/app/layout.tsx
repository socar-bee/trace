import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import './globals.css'

import { cookies } from 'next/headers'

import DockBar from '@/shared/components/layout/DockBar'

import { APP_DESCRIPTION, APP_HOST, APP_NAME, APP_TAGLINE } from '@/shared/lib/constants'
import { META_KEYWORDS } from '@/shared/lib/seo'

import type { Metadata, Viewport } from 'next'

import QueryProvider from '@/shared/providers/QueryProvider'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}

export const metadata: Metadata = {
  metadataBase: new URL(APP_HOST),
  title: {
    default: `${APP_NAME} · ${APP_TAGLINE}`,
    template: `%s · ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  keywords: META_KEYWORDS.MAIN,
  applicationName: APP_NAME,
  openGraph: {
    title: `${APP_NAME} · ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    locale: 'ko_KR',
    type: 'website',
    url: APP_HOST
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} · ${APP_TAGLINE}`,
    description: APP_DESCRIPTION
  },
  icons: {
    icon: '/icons/favicon.ico'
  },
  robots: {
    index: true,
    follow: true
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const fromApp = (await cookies()).get('tr_from_app')?.value === '1'

  return (
    <html lang="ko" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`bg-bg-white text-text-strong font-sans antialiased ${
          fromApp ? '' : 'pb-[var(--dock-height,0px)] md:pb-0'
        }`}
      >
        <QueryProvider>{children}</QueryProvider>
        {!fromApp && <DockBar />}
      </body>
    </html>
  )
}
