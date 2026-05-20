import Link from 'next/link'

import { IcoFire } from '@/shared/components/icons'

import type { PopularParkingLot } from '@/shared/types/trace'

import WidgetCard from './WidgetCard'

interface Props {
  hot: PopularParkingLot[]
}

export default function HotParkingsWidget({ hot }: Props) {
  return (
    <WidgetCard title="🔥 지금 핫한 곳" moreHref="/search">
      <ul className="divide-stroke-soft -my-1 divide-y">
        {hot.map((p, i) => (
          <li key={p.seq}>
            <Link
              href={`/p/${p.seq}`}
              className="hover:bg-bg-weak/60 -mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors"
            >
              <span className="text-negative-600 inline-flex w-5 shrink-0 justify-center text-sm font-black tabular-nums">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-text-strong block truncate text-sm font-semibold">{p.name}</span>
                <span className="text-text-soft mt-0.5 flex items-center gap-1.5 text-[11px]">
                  <span className="tabular-nums">⭐ {p.avgRating.toFixed(1)}</span>
                  <span>·</span>
                  <span className="tabular-nums">후기 {p.totalReviewCount}</span>
                </span>
              </span>
              {(p.hotScore ?? 0) > 0 && (
                <span className="bg-negative-50 text-negative-700 ring-negative-100 inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ring-1">
                  <IcoFire className="size-2.5" />+{p.hotScore}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </WidgetCard>
  )
}
