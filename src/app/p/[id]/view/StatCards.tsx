import { StarRatingDisplay } from '@/shared/components/ui/StarRating'

import { formatRating, formatRevisitRate } from '@/shared/lib/format'

import type { ParkingLotStats } from '@/shared/types/trace'

interface StatCardsProps {
  stats: ParkingLotStats
}

export default function StatCards({ stats }: StatCardsProps) {
  const items = [
    {
      label: '평균 별점',
      value: stats.totalReviewCount > 0 ? formatRating(stats.avgRating) : '-',
      sub: stats.totalReviewCount > 0 ? <StarRatingDisplay value={stats.avgRating} size={12} /> : null
    },
    {
      label: '총 흔적',
      value: stats.totalReviewCount.toString(),
      sub: <span className="text-text-soft text-xs">건</span>
    },
    {
      label: '재방문율',
      value: stats.totalReviewCount > 0 ? formatRevisitRate(stats.revisitRate) : '-',
      sub: null
    }
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item) => (
        <div key={item.label} className="border-stroke-soft rounded-xl border bg-white p-3 md:p-4">
          <p className="text-text-soft text-xs font-medium md:text-sm">{item.label}</p>
          <p className="text-text-strong mt-1 flex items-baseline gap-1.5 text-xl font-bold tabular-nums md:mt-2 md:text-2xl">
            {item.value}
            {item.sub}
          </p>
        </div>
      ))}
    </div>
  )
}
