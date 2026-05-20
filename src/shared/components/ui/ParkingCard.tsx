import Link from 'next/link'

import { IcoChevronRight, IcoFire, IcoMapPin, IcoStar, IcoThumbsUp, IcoTrending } from '@/shared/components/icons'

import { formatRating } from '@/shared/lib/format'

import type { PopularParkingLot } from '@/shared/types/trace'

export type CardEmphasis = 'hot' | 'recommend' | 'weekly'

interface ParkingCardProps {
  data: PopularParkingLot
  emphasis?: CardEmphasis
  index?: number
}

const EMPHASIS_STYLES: Record<
  CardEmphasis,
  {
    strip: string
    badgeBg: string
    badgeText: string
    badgeRing: string
    icon: React.ReactNode
    label: (d: PopularParkingLot) => string
  }
> = {
  hot: {
    strip: 'bg-gradient-to-b from-red-500 to-orange-500',
    badgeBg: 'bg-red-500',
    badgeText: 'text-white',
    badgeRing: '',
    icon: <IcoFire className="size-3" />,
    label: (d) => `+${d.hotScore ?? 0}건`
  },
  recommend: {
    strip: 'bg-gradient-to-b from-accent-500 to-accent-700',
    badgeBg: 'bg-accent-600',
    badgeText: 'text-white',
    badgeRing: '',
    icon: <IcoThumbsUp className="size-3" />,
    label: (d) => `${(d.recommendUpCount ?? 0).toLocaleString('ko-KR')}`
  },
  weekly: {
    strip: 'bg-gradient-to-b from-brand-500 to-brand-700',
    badgeBg: 'bg-brand-50',
    badgeText: 'text-brand-700',
    badgeRing: 'ring-1 ring-brand-100',
    icon: <IcoTrending className="size-3" />,
    label: (d) => `+${d.weeklyNewReviewCount}`
  }
}

export default function ParkingCard({ data, emphasis = 'weekly', index = 0 }: ParkingCardProps) {
  const style = EMPHASIS_STYLES[emphasis]
  const stagger = Math.min(index * 40, 240)

  return (
    <Link
      href={`/p/${data.seq}`}
      className="group border-stroke-soft hover:border-stroke-sub relative flex overflow-hidden rounded-2xl border bg-white transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-02)] motion-safe:animate-[fadeUp_0.6s_ease-out_both]"
      style={{ animationDelay: `${stagger}ms` }}
    >
      {/* 좌측 컬러 strip — emphasis 시그니처 + 타이어 트레드 overlay */}
      <span aria-hidden className={`${style.strip} relative w-2 shrink-0`}>
        <span className="absolute inset-0 flex flex-col justify-around py-3">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <span key={i} className="mx-0.5 h-1.5 rounded-[1px] bg-white/55" />
          ))}
        </span>
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-text-strong group-hover:text-brand-700 line-clamp-2 text-base font-bold tracking-tight transition-colors md:text-lg">
              {data.name}
            </h3>
            <p className="text-text-soft mt-1 flex items-center gap-1 truncate text-xs">
              <IcoMapPin className="text-icon-soft size-3 shrink-0" />
              <span className="truncate">{data.address}</span>
            </p>
          </div>
          <span
            className={`${style.badgeBg} ${style.badgeText} ${style.badgeRing} inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums shadow-[var(--shadow-01)]`}
          >
            {style.icon}
            {style.label(data)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5">
              <IcoStar className="text-star size-4 drop-shadow-[0_1px_2px_rgba(245,158,11,0.4)]" filled />
              <span className="text-text-strong text-base font-bold tabular-nums">
                {data.totalReviewCount > 0 ? formatRating(data.avgRating) : '-'}
              </span>
            </span>
            <span className="bg-stroke-soft h-3 w-px" aria-hidden />
            <span className="text-text-sub text-xs">
              후기 <span className="text-text-strong font-semibold tabular-nums">{data.totalReviewCount}</span>
            </span>
            {(data.recommendUpCount ?? 0) > 0 && emphasis !== 'recommend' && (
              <>
                <span className="bg-stroke-soft h-3 w-px" aria-hidden />
                <span className="text-accent-700 inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums">
                  👍 {data.recommendUpCount}
                </span>
              </>
            )}
          </div>
          <IcoChevronRight className="text-icon-soft size-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
