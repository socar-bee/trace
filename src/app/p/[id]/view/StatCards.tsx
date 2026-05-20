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
      unit: stats.totalReviewCount > 0 ? '/5' : ''
    },
    {
      label: '총 후기',
      value: stats.totalReviewCount.toString(),
      unit: '건'
    },
    {
      label: '재방문율',
      value: stats.totalReviewCount > 0 ? formatRevisitRate(stats.revisitRate) : '-',
      unit: ''
    }
  ]

  return (
    <div className="border-line bg-bg mb-6 grid grid-cols-3 overflow-hidden rounded-xl border">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`px-3.5 py-4 md:px-4 md:py-5 ${i < items.length - 1 ? 'border-line border-r' : ''}`}
        >
          <p className="text-fg-3 mb-1.5 font-mono text-[9px] tracking-[0.05em] uppercase">{item.label}</p>
          <p className="text-fg flex items-baseline gap-1 text-[22px] font-bold tracking-[-0.025em] tabular-nums md:text-2xl">
            {item.value}
            {item.unit && <span className="text-fg-3 font-mono text-[11px] font-normal">{item.unit}</span>}
          </p>
        </div>
      ))}
    </div>
  )
}
