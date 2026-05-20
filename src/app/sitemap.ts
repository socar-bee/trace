import { APP_HOST } from '@/shared/lib/constants'

import type { MetadataRoute } from 'next'

import { MOCK_PARKING_LOTS } from '@/shared/mocks/parkingLots'

export const dynamic = 'force-dynamic'

export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.APP_ENV !== 'prod') return []

  const routes: MetadataRoute.Sitemap = [{ url: `${APP_HOST}/`, changeFrequency: 'daily', priority: 1 }]

  for (const lot of MOCK_PARKING_LOTS) {
    routes.push({
      url: `${APP_HOST}/p/${lot.seq}`,
      changeFrequency: 'daily',
      priority: 0.8,
      lastModified: new Date()
    })
  }

  return routes
}
