import Link from 'next/link'

import { IcoChevronRight, IcoMapPin } from '@/shared/components/icons'
import { StarRatingDisplay } from '@/shared/components/ui/StarRating'

import { formatRating } from '@/shared/lib/format'

interface ParkingCardProps {
  seq: string
  name: string
  address: string
  avgRating: number
  totalReviewCount: number
  weeklyNewReviewCount?: number
  size?: 'sm' | 'md'
}

export default function ParkingCard({
  seq,
  name,
  address,
  avgRating,
  totalReviewCount,
  weeklyNewReviewCount,
  size = 'md'
}: ParkingCardProps) {
  return (
    <Link
      href={`/p/${seq}`}
      className="group border-stroke-soft hover:border-stroke-sub flex flex-col gap-3 rounded-2xl border bg-white p-4 transition-colors md:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className={`text-text-strong line-clamp-2 font-semibold ${
              size === 'sm' ? 'text-sm md:text-base' : 'text-base md:text-lg'
            }`}
          >
            {name}
          </h3>
          <p className="text-text-soft mt-1 flex items-center gap-1 truncate text-xs">
            <IcoMapPin className="text-icon-soft size-3 shrink-0" />
            {address}
          </p>
        </div>
        {typeof weeklyNewReviewCount === 'number' && weeklyNewReviewCount > 0 && (
          <span className="bg-accent-50 text-accent-700 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums">
            이번 주 +{weeklyNewReviewCount}
          </span>
        )}
      </div>

      <div className="text-text-sub flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-2">
          <StarRatingDisplay value={avgRating} size={14} />
          <span className="tabular-nums">
            <span className="text-text-strong font-semibold">{formatRating(avgRating)}</span>
            <span className="text-text-soft"> · 흔적 {totalReviewCount}</span>
          </span>
        </span>
        <IcoChevronRight className="text-icon-soft transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}
