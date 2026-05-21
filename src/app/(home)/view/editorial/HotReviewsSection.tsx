import Image from 'next/image'
import Link from 'next/link'

import NickAvatar from '@/shared/components/ui/NickAvatar'

import { TAGS } from '@/shared/lib/tags'

import type { HotReviewToday } from '@/shared/mocks/api'

interface HotReviewsSectionProps {
  reviews: HotReviewToday[]
}

function relTime(hours: number): string {
  if (hours < 1) return '방금'
  if (hours < 24) return `${hours}시간 전`
  const d = Math.floor(hours / 24)
  if (d < 7) return `${d}일 전`
  return `${Math.floor(d / 7)}주 전`
}

export default function HotReviewsSection({ reviews }: HotReviewsSectionProps) {
  if (reviews.length === 0) return null

  const todayLabel = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })

  return (
    <section className="border-line border-b">
      <div className="mx-auto max-w-[1200px] px-6 py-11">
        <header className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-fg flex items-center gap-2 font-mono text-[13px] font-semibold tracking-[0.02em] uppercase">
            <Image src="/icons/icn_fire.png" alt="" width={20} height={20} aria-hidden className="shrink-0" />
            Today`s Hot 후기
          </h2>
          <span className="text-fg-3 font-mono text-[11px]">{todayLabel} · 최근 12시간</span>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {reviews.map((r) => {
            const fillPct = (Math.max(0, Math.min(5, r.rating)) / 5) * 100
            return (
              <Link
                key={r.reviewId}
                href={`/p/${r.parkingLotSeq}`}
                className="border-line bg-bg hover:border-accent hover:bg-brand-50 group flex min-w-0 flex-col gap-2.5 rounded-xl border p-4 transition-colors"
              >
                <div className="flex min-w-0 items-baseline justify-between gap-2">
                  <span className="text-fg min-w-0 truncate text-[13px] font-bold tracking-tight">
                    {r.parkingLotName}
                  </span>
                  {r.areaLabel && (
                    <span className="text-fg-3 shrink-0 font-mono text-[10px] tracking-wide">{r.areaLabel}</span>
                  )}
                </div>

                <div className="text-fg-3 flex items-center gap-2 font-mono text-[11px]">
                  <span className="relative inline-block leading-none" aria-label={`별점 ${r.rating}점`}>
                    <span className="text-fg-4">★★★★★</span>
                    <span
                      className="text-caution-500 absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap"
                      style={{ width: `${fillPct}%` }}
                      aria-hidden
                    >
                      ★★★★★
                    </span>
                  </span>
                  <span className="text-fg-3">{relTime(r.hoursAgo)}</span>
                </div>

                <p className="text-fg line-clamp-3 flex-1 text-[13px] leading-relaxed">{r.content}</p>

                <div className="border-line flex min-w-0 items-center justify-between gap-2 border-t border-dashed pt-2.5">
                  <NickAvatar nickname={r.nickname} style="initial" showName className="text-[11px]" />
                  {r.tags.length > 0 && (
                    <span className="flex shrink-0 gap-1">
                      {r.tags.slice(0, 2).map((tagKey) => {
                        const meta = TAGS.find((t) => t.key === tagKey)
                        if (!meta) return null
                        const sentimentClass =
                          meta.sentiment === 'positive'
                            ? 'border-pos text-pos bg-pos-soft'
                            : meta.sentiment === 'negative'
                              ? 'border-neg text-neg bg-neg-soft'
                              : 'border-fg-3 text-fg-2'
                        return (
                          <span
                            key={tagKey}
                            className={`inline-flex border px-1.5 py-0.5 text-[10px] tracking-wide whitespace-nowrap ${sentimentClass}`}
                          >
                            {meta.label}
                          </span>
                        )
                      })}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
