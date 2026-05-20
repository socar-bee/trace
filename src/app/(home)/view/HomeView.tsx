'use client'

import type { LiveActivity, TotalStats } from '@/shared/mocks/api'

import type { PopularParkingLot } from '@/shared/types/trace'

import ActivityTicker from './editorial/ActivityTicker'
import AreaChips from './editorial/AreaChips'
import DemoStrip from './editorial/DemoStrip'
import HeroEditorial from './editorial/HeroEditorial'
import HowItWorks from './editorial/HowItWorks'
import LotsSection from './editorial/LotsSection'

interface HomeViewProps {
  lots: PopularParkingLot[]
  stats: TotalStats
  activities: LiveActivity[]
}

const VERIFIED_RATE = 87

export default function HomeView({ lots, stats, activities }: HomeViewProps) {
  return (
    <>
      <DemoStrip />
      <HeroEditorial
        totalReviews={stats.totalReviews}
        totalLots={stats.totalParkingLots}
        verifiedRate={VERIFIED_RATE}
      />
      <ActivityTicker activities={activities} />
      <AreaChips totalLots={lots.length} />
      <LotsSection lots={lots} />
      <HowItWorks />
    </>
  )
}
