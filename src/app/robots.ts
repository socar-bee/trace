import { APP_HOST } from '@/shared/lib/constants'

import type { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  if (process.env.APP_ENV === 'prod') {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/write', '/me']
      },
      sitemap: `${APP_HOST}/sitemap.xml`
    }
  }

  return {
    rules: {
      userAgent: '*',
      disallow: '/'
    }
  }
}
