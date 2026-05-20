import Link from 'next/link'

import { formatRelativeTime } from '@/shared/lib/format'

import type { RecentReview } from '@/shared/mocks/api'

import WidgetCard from './WidgetCard'

interface Props {
  reviews: RecentReview[]
}

export default function RecentReviewsWidget({ reviews }: Props) {
  return (
    <WidgetCard title="최신 후기" moreHref="/search">
      <ul className="divide-stroke-soft -my-1 divide-y">
        {reviews.map((r) => (
          <li key={r.reviewId}>
            <Link
              href={`/p/${r.parkingLotSeq}`}
              className="hover:bg-bg-weak/60 -mx-2 flex items-center gap-2 rounded-md px-2 py-2.5 transition-colors"
            >
              <span className="min-w-0 flex-1">
                <span className="text-text-strong inline-flex items-baseline gap-1.5 truncate text-sm">
                  <span className="truncate font-semibold">{r.parkingLotName}</span>
                  {r.content && <span className="text-text-soft truncate text-xs">— {r.content.slice(0, 24)}</span>}
                  {r.isNew && (
                    <span className="text-negative-500 ml-0.5 shrink-0 text-[10px] font-black uppercase">N</span>
                  )}
                </span>
              </span>
              <span className="text-text-soft shrink-0 text-xs tabular-nums">{formatRelativeTime(r.createdAt)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </WidgetCard>
  )
}
