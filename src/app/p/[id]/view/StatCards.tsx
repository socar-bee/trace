import { formatRating, formatRevisitRate } from '@/shared/lib/format'

import type { ParkingLotStats } from '@/shared/types/trace'

interface StatCardsProps {
  stats: ParkingLotStats
}

/**
 * 주차장 상세 stat — Hero receipt 톤 통일.
 * 박스 border 없이 dashed 위/아래 절취선 + 3col grid + 큰 숫자 + 별 채움.
 */
export default function StatCards({ stats }: StatCardsProps) {
  const hasReviews = stats.totalReviewCount > 0
  const avgRating = hasReviews ? stats.avgRating : 0
  const reviewCount = stats.totalReviewCount
  const revisitPct = hasReviews ? formatRevisitRate(stats.revisitRate).replace('%', '') : '-'
  const fillPct = (Math.max(0, Math.min(5, avgRating)) / 5) * 100

  return (
    <dl className="border-fg mb-7 grid grid-cols-3 border-y border-dashed py-6">
      {/* AVG */}
      <div className="border-line-2 border-r border-dotted px-4">
        <dt className="text-fg-3 mb-2.5 font-mono text-[10px] tracking-[0.15em] uppercase">avg</dt>
        <div className="mb-2 h-[16px] text-[14px] leading-none">
          {hasReviews && (
            <span className="relative inline-block leading-none">
              <span className="text-fg-4">★★★★★</span>
              <span
                className="text-caution-500 absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap"
                style={{ width: `${fillPct}%` }}
                aria-hidden
              >
                ★★★★★
              </span>
            </span>
          )}
        </div>
        <dd className="text-fg flex items-baseline gap-0.5 text-[28px] leading-none font-extrabold tracking-[-0.02em] tabular-nums">
          {hasReviews ? formatRating(avgRating) : '-'}
          {hasReviews && <span className="text-fg-3 font-mono text-xs font-normal">/5</span>}
        </dd>
      </div>

      {/* LOGS */}
      <div className="border-line-2 border-r border-dotted px-4">
        <dt className="text-fg-3 mb-2.5 font-mono text-[10px] tracking-[0.15em] uppercase">logs</dt>
        <div className="mb-2 h-[16px]" />
        <dd className="text-fg flex items-baseline gap-0.5 text-[28px] leading-none font-extrabold tracking-[-0.02em] tabular-nums">
          {reviewCount.toLocaleString('ko-KR')}
          <span className="text-fg-3 font-mono text-xs font-normal">건</span>
        </dd>
      </div>

      {/* AGAIN */}
      <div className="px-4">
        <dt className="text-fg-3 mb-2.5 font-mono text-[10px] tracking-[0.15em] uppercase">again</dt>
        <div className="mb-2 h-[16px]" />
        <dd className="text-fg flex items-baseline gap-0.5 text-[28px] leading-none font-extrabold tracking-[-0.02em] tabular-nums">
          {revisitPct}
          {hasReviews && <span className="text-fg-3 font-mono text-xs font-normal">%</span>}
        </dd>
      </div>
    </dl>
  )
}
