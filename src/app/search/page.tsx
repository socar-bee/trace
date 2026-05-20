import AppFooter from '@/shared/components/layout/AppFooter'
import AppHeader from '@/shared/components/layout/AppHeader'

import { POPULAR_AREAS } from '@/shared/lib/constants'

import type { Metadata } from 'next'

import type { PopularParkingLot } from '@/shared/types/trace'

import { fetchParkingLotsByArea, searchParkingLotsApi } from '@/shared/mocks/api'
import { getReviewsBySeq, getWeeklyNewReviewCount } from '@/shared/mocks/reviews'

import SearchView from './view/SearchView'

interface PageProps {
  searchParams: Promise<{ q?: string; area?: string }>
}

export const metadata: Metadata = {
  title: '주차장 검색',
  description: '주차장 이름이나 지역으로 흔적을 찾아보세요.'
}

function aggregateForList(lot: { seq: string; name: string; address: string; areaKey?: string }): PopularParkingLot {
  const reviews = getReviewsBySeq(lot.seq)
  const total = reviews.length
  const avg = total === 0 ? 0 : Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10
  return {
    seq: lot.seq,
    name: lot.name,
    address: lot.address,
    areaKey: lot.areaKey,
    weeklyNewReviewCount: getWeeklyNewReviewCount(lot.seq),
    avgRating: avg,
    totalReviewCount: total
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, area } = await searchParams
  const keyword = q?.trim() ?? ''
  const areaLabel = area ? POPULAR_AREAS.find((a) => a.key === area)?.label : undefined

  let results: PopularParkingLot[] = []
  if (areaLabel) {
    const lots = await fetchParkingLotsByArea(area as string)
    results = lots
  } else if (keyword) {
    const lots = await searchParkingLotsApi(keyword)
    results = lots.map(aggregateForList)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader showSearch />
      <SearchView keyword={keyword} areaKey={area ?? null} areaLabel={areaLabel ?? null} results={results} />
      <AppFooter />
    </div>
  )
}
