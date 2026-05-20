import { IcoMapPin } from '@/shared/components/icons'
import RecommendButtons from '@/shared/components/ui/RecommendButtons'

import { formatPrice } from '@/shared/lib/format'

import type { ParkingLotDetailResult } from '@/shared/mocks/api'

import ExternalMapLinks from './ExternalMapLinks'
import MiniMap from './MiniMap'
import ReviewList from './ReviewList'
import StatCards from './StatCards'
import TagSummary from './TagSummary'

interface ParkingDetailViewProps {
  seq: string
  initial: ParkingLotDetailResult
}

export default function ParkingDetailView({ seq, initial }: ParkingDetailViewProps) {
  const { info, stats, topTags, reviews, hasNext, recommend } = initial

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 md:px-6 md:py-10">
      {/* Header */}
      <header className="mb-6 md:mb-10">
        <h1 className="text-text-strong text-2xl leading-tight font-bold md:text-3xl">{info.name}</h1>
        <p className="text-text-sub mt-2 flex items-center gap-1.5 text-sm">
          <IcoMapPin className="text-icon-soft size-4" />
          {info.address}
        </p>
        <p className="text-text-strong mt-1 text-sm">
          시간당 <span className="font-bold tabular-nums">{formatPrice(info.hourlyPrice)}원</span>
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,360px)_1fr] md:gap-10">
        {/* 좌측 사이드 (데스크탑 sticky) */}
        <aside className="flex flex-col gap-4 md:sticky md:top-24 md:self-start">
          <MiniMap name={info.name} latitude={info.latitude} longitude={info.longitude} />
          <ExternalMapLinks name={info.name} latitude={info.latitude} longitude={info.longitude} />
          <StatCards stats={stats} />

          <section>
            <h2 className="text-text-strong mb-2.5 text-sm font-semibold">이 주차장 어때요?</h2>
            <RecommendButtons parkingLotSeq={seq} baseUpCount={recommend.upCount} baseDownCount={recommend.downCount} />
          </section>

          <section>
            <h2 className="text-text-strong mb-2.5 text-sm font-semibold">자주 언급된 태그</h2>
            <TagSummary topTags={topTags} />
          </section>
        </aside>

        {/* 우측 후기 리스트 */}
        <section>
          <ReviewList seq={seq} initialReviews={reviews} initialHasNext={hasNext} totalCount={stats.totalReviewCount} />
        </section>
      </div>
    </main>
  )
}
