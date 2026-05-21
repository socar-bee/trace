'use client'

import type { HotReviewToday, LiveActivity } from '@/shared/mocks/api'

import type { PopularParkingLot } from '@/shared/types/trace'

import ActivityTicker from './editorial/ActivityTicker'
import DemoStrip from './editorial/DemoStrip'
import HeroEditorial from './editorial/HeroEditorial'
import HotReviewsSection from './editorial/HotReviewsSection'
import HowItWorks from './editorial/HowItWorks'
import LotsSection from './editorial/LotsSection'

interface HomeViewProps {
  lots: PopularParkingLot[]
  activities: LiveActivity[]
  hotReviews: HotReviewToday[]
}

export default function HomeView({ lots, activities, hotReviews }: HomeViewProps) {
  return (
    <>
      <DemoStrip />
      <HeroEditorial compact />
      <ActivityTicker activities={activities} />
      <HotReviewsSection reviews={hotReviews} />
      <LotsSection lots={lots} />
      <HowItWorks />
    </>
  )
}
