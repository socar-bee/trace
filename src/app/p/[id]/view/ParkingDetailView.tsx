import Link from 'next/link'

import type { ParkingLotDetailResult } from '@/shared/mocks/api'

import BuyTicketCTA from './BuyTicketCTA'
import MiniMap from './MiniMap'
import RecommendPoll from './RecommendPoll'
import ReviewList from './ReviewList'
import StatCards from './StatCards'
import TagSummary from './TagSummary'
import WriteCTA from './WriteCTA'

interface ParkingDetailViewProps {
  seq: string
  initial: ParkingLotDetailResult
}

export default function ParkingDetailView({ seq, initial }: ParkingDetailViewProps) {
  const { info, stats, topTags, reviews, hasNext, recommend } = initial

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="text-fg-3 py-5 pb-2 font-mono text-[11px]">
          <Link href="/" className="hover:text-fg transition-colors">
            trace
          </Link>
          {' / '}
          {info.areaLabel ? <span className="text-fg">{info.areaLabel}</span> : <span className="text-fg">P{seq}</span>}
        </nav>

        <div className="md:border-line grid gap-0 md:grid-cols-[360px_1fr] md:gap-0 md:border-t">
          {/* 좌측 사이드 (데스크탑 sticky) */}
          <aside className="border-line py-6 md:sticky md:top-24 md:self-start md:border-r md:py-8 md:pr-7">
            <h1 className="text-fg text-[clamp(26px,4vw,36px)] leading-[1.15] font-bold tracking-[-0.025em]">
              {info.name}
            </h1>
            <p className="text-fg-3 mt-2.5 text-[13px]">{info.address}</p>

            {(info.pricePer != null || info.totalSpots != null || info.open) && (
              <div className="border-line text-fg-3 my-[18px] flex flex-wrap gap-x-5 gap-y-1 border-y py-3 font-mono text-[11px]">
                {info.pricePer != null && info.priceUnit && (
                  <span>
                    <b className="text-fg font-medium">₩{info.pricePer.toLocaleString('ko-KR')}</b>
                    <span className="text-fg-3 ml-1">/{info.priceUnit}</span>
                  </span>
                )}
                {info.totalSpots != null && (
                  <span>
                    <b className="text-fg font-medium">{info.totalSpots}</b>
                    <span className="text-fg-3 ml-1">면</span>
                  </span>
                )}
                {info.open && (
                  <span>
                    <b className="text-fg font-medium">{info.open}</b>
                  </span>
                )}
              </div>
            )}

            {(info.gateType || (info.badges && info.badges.length > 0)) && (
              <>
                <p className="text-fg-3 mb-2 font-mono text-[10px] tracking-[0.05em] uppercase">GATE · 설비</p>
                <p className="text-fg-2 text-[13px]">
                  {info.gateType}
                  {info.badges && info.badges.length > 0 && (
                    <>
                      <br />
                      <span className="text-fg-3 font-mono text-[11px]">{info.badges.join(' · ')}</span>
                    </>
                  )}
                </p>
              </>
            )}

            <div className="mt-[18px] flex flex-col gap-3.5">
              <MiniMap name={info.name} latitude={info.latitude} longitude={info.longitude} />
              <BuyTicketCTA latitude={info.latitude} longitude={info.longitude} />
            </div>
          </aside>

          {/* 우측 main */}
          <section className="py-6 md:py-8 md:pl-9">
            <StatCards stats={stats} />

            <RecommendPoll parkingLotSeq={seq} baseUpCount={recommend.upCount} baseDownCount={recommend.downCount} />

            <section className="mb-6">
              <h2 className="text-fg mb-3 text-sm font-bold tracking-[0.02em] uppercase">자주 언급된 태그</h2>
              <TagSummary topTags={topTags} />
            </section>

            <ReviewList
              seq={seq}
              initialReviews={reviews}
              initialHasNext={hasNext}
              totalCount={stats.totalReviewCount}
            />

            <WriteCTA seq={seq} />
          </section>
        </div>
      </div>
    </main>
  )
}
