import Link from 'next/link'

import { IcoStar } from '@/shared/components/icons'

import type { PopularParkingLot } from '@/shared/types/trace'

interface LotCardEditorialProps {
  lot: PopularParkingLot
  rank: number
}

export default function LotCardEditorial({ lot, rank }: LotCardEditorialProps) {
  const isCold = !lot.hot
  return (
    <Link
      href={`/p/${lot.seq}`}
      className="border-line bg-bg hover:border-accent group relative flex cursor-pointer flex-col gap-3 rounded-xl border p-[18px] transition-all hover:-translate-y-px hover:shadow-[var(--shadow-02)]"
    >
      {/* pulse dot */}
      <span
        aria-hidden
        className={`absolute top-4 right-4 size-1.5 rounded-full ${
          isCold ? 'bg-fg-4' : 'animate-[pulse-dot_2s_ease-in-out_infinite] bg-[var(--color-accent-500)]'
        }`}
      />

      {/* rank · area */}
      <div className="text-fg-3 font-mono text-[11px]">
        <b className="text-accent font-medium">#{String(rank).padStart(2, '0')}</b> · {lot.areaLabel ?? '—'}
      </div>

      <div>
        <div className="text-fg text-[17px] leading-snug font-semibold tracking-[-0.015em]">{lot.name}</div>
        <div className="text-fg-3 mt-1 flex items-center gap-1.5 text-[12px]">
          <span className="bg-fg-3 inline-block h-px w-2" aria-hidden />
          {lot.address}
        </div>
      </div>

      <div className="border-line text-fg-3 mt-auto flex flex-wrap items-center gap-3 border-t border-dashed pt-3 font-mono text-[11px]">
        <span className="inline-flex items-center gap-px" aria-label={`별점 ${lot.avgRating} / 5`}>
          {[1, 2, 3, 4, 5].map((n) => {
            const on = n <= Math.round(lot.avgRating)
            return (
              <IcoStar
                key={n}
                width={12}
                height={12}
                filled={on}
                className={on ? 'text-[var(--color-star)]' : 'text-fg-4'}
              />
            )
          })}
        </span>
        <span className="whitespace-nowrap">
          <b className="text-fg mr-1 font-medium">{lot.avgRating.toFixed(1)}</b>
        </span>
        <span className="whitespace-nowrap">
          <b className="text-fg mr-1 font-medium">{lot.totalReviewCount}</b>후기
        </span>
        {lot.revisitRatePct != null && (
          <span className="whitespace-nowrap">
            <b className="text-fg mr-1 font-medium">{lot.revisitRatePct}%</b>재방문
          </span>
        )}
      </div>
    </Link>
  )
}
