import type { TotalStats } from '@/shared/mocks/api'

interface HeroStatsProps {
  stats: TotalStats
}

function fmt(n: number): string {
  return n.toLocaleString('ko-KR')
}

export default function HeroStats({ stats }: HeroStatsProps) {
  const items = [
    { label: '누적 후기', value: fmt(stats.totalReviews), accent: 'text-brand-600' },
    { label: '검증 운전자', value: fmt(stats.totalActiveDrivers), accent: 'text-accent-600' },
    { label: '추천', value: fmt(stats.totalRecommends), accent: 'text-orange-600' },
    { label: '주차장', value: fmt(stats.totalParkingLots), accent: 'text-purple-700' }
  ]
  return (
    <ul className="border-stroke-soft mt-8 grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl border bg-white/70 p-4 backdrop-blur-sm sm:grid-cols-4 md:mt-12">
      {items.map((it) => (
        <li key={it.label} className="flex items-baseline gap-1.5 sm:flex-col sm:items-start sm:gap-0">
          <span className={`text-xl font-black tracking-tight tabular-nums md:text-2xl ${it.accent}`}>{it.value}</span>
          <span className="text-text-soft text-xs font-medium md:text-[13px]">{it.label}</span>
        </li>
      ))}
    </ul>
  )
}
