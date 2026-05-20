import Link from 'next/link'

import { IcoChevronRight, IcoSparkle, IcoStar, IcoTireMarksDual } from '@/shared/components/icons'

import { formatRating } from '@/shared/lib/format'

import type { PopularParkingLot } from '@/shared/types/trace'

interface TodayPickHeroProps {
  pick: PopularParkingLot
}

export default function TodayPickHero({ pick }: TodayPickHeroProps) {
  const total = (pick.recommendUpCount ?? 0) + (pick.recommendDownCount ?? 0)
  const upRatio = total === 0 ? 0 : Math.round(((pick.recommendUpCount ?? 0) / total) * 100)

  return (
    <Link
      href={`/p/${pick.seq}`}
      className="group relative isolate block overflow-hidden rounded-3xl bg-[radial-gradient(ellipse_at_top_right,#33ADFF_0%,#0099FF_30%,#005C99_65%,#003D66_100%)] p-7 text-white transition-transform hover:scale-[1.005] active:scale-[0.99] md:p-12"
    >
      {/* 배경 데코 — 차량이 지나간 바퀴 후기 패턴 */}
      <TireTracksDecor />

      {/* 글래스 텍스처 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-32 size-96 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="bg-mint-500/15 pointer-events-none absolute -bottom-32 -left-16 size-[28rem] rounded-full blur-3xl"
      />

      <div className="relative z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase ring-1 ring-white/20 backdrop-blur">
          <IcoSparkle className="size-3.5" />
          오늘의 주차장
        </span>

        <h2 className="mt-6 text-3xl leading-[1.05] font-black tracking-tight md:mt-8 md:text-5xl">{pick.name}</h2>
        <p className="mt-3 text-sm text-white/75 md:text-base">{pick.address}</p>

        {/* 큰 평점 시각화 */}
        <div className="mt-7 flex flex-wrap items-end gap-x-6 gap-y-4 md:mt-10">
          <div className="flex items-baseline gap-2">
            <span className="text-star text-4xl font-black tabular-nums drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)] md:text-6xl">
              {formatRating(pick.avgRating)}
            </span>
            <span className="text-base font-medium text-white/60 md:text-lg">/ 5</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <IcoStar
                  key={n}
                  width={16}
                  height={16}
                  filled={n <= Math.round(pick.avgRating)}
                  className={n <= Math.round(pick.avgRating) ? 'text-star' : 'text-white/25'}
                />
              ))}
            </span>
            <span className="text-xs text-white/70 tabular-nums">
              후기 {pick.totalReviewCount}건
              {upRatio > 0 && <span className="text-accent-300"> · 👍 {upRatio}% 추천</span>}
            </span>
          </div>
        </div>

        <span className="text-brand-700 mt-8 inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-sm font-bold shadow-[var(--shadow-02)] transition-transform group-hover:translate-x-1 md:mt-12">
          후기 보러가기
          <IcoChevronRight className="size-4" />
        </span>
      </div>
    </Link>
  )
}

function TireTracksDecor() {
  // 4 차로의 바퀴 후기 — hero 배경에 도로 위 후기가 흩어진 인상.
  // 결정론적 위치 (SSR-CSR 일관).
  const tracks = [
    { top: '6%', left: '60%', rotate: -12, opacity: 0.18, scale: 0.7 },
    { top: '30%', left: '78%', rotate: 8, opacity: 0.12, scale: 0.55 },
    { top: '62%', left: '4%', rotate: -8, opacity: 0.16, scale: 0.65 },
    { top: '78%', left: '52%', rotate: 14, opacity: 0.1, scale: 0.5 }
  ]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {tracks.map((t, i) => (
        <IcoTireMarksDual
          key={i}
          className="absolute text-white"
          style={{
            top: t.top,
            left: t.left,
            opacity: t.opacity,
            transform: `rotate(${t.rotate}deg) scale(${t.scale})`,
            transformOrigin: 'left top'
          }}
        />
      ))}
    </div>
  )
}
