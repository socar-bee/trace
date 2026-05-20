import AppFooter from '@/shared/components/layout/AppFooter'
import AppHeader from '@/shared/components/layout/AppHeader'

import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from '@/shared/lib/constants'
import { META_KEYWORDS } from '@/shared/lib/seo'

import type { Metadata } from 'next'

import { fetchLiveActivities, fetchPopularParkingLots, fetchTotalStats } from '@/shared/mocks/api'

import HomeView from './view/HomeView'

export const metadata: Metadata = {
  title: `${APP_NAME} · ${APP_TAGLINE}`,
  description: APP_DESCRIPTION,
  keywords: META_KEYWORDS.MAIN
}

export const revalidate = 600

export default async function HomePage() {
  const [lots, stats, activities] = await Promise.all([
    fetchPopularParkingLots(12),
    fetchTotalStats(),
    fetchLiveActivities(10)
  ])

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader showSearch />
      <main className="flex-1">
        <HomeView lots={lots} stats={stats} activities={activities} />
      </main>
      <AppFooter />
    </div>
  )
}
