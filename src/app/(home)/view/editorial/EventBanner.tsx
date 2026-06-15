import Link from 'next/link'

/**
 * Hero 우측 — FSD 럭키드로우 이벤트 진행중 배너 (쿠폰 AdSlot 위).
 * 다크 + 블루 하드 그림자로 화이트 히어로 위에서 도드라지게.
 */
export default function EventBanner() {
  return (
    <Link
      href="/event/fsd-draw"
      aria-label="FSD 럭키드로우 이벤트 응모하기"
      className="border-fg bg-fg text-static-white group relative mb-4 block overflow-hidden border-[1.5px] px-4 py-3.5 transition-transform hover:-translate-y-0.5"
      style={{ boxShadow: '3px 3px 0 var(--color-brand-500)' }}
    >
      <span
        className="from-brand-500/25 pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b to-transparent"
        aria-hidden
      />
      <span className="text-static-white/[0.07] pointer-events-none absolute -right-2 -bottom-4 font-mono text-[58px] leading-none font-extrabold select-none">
        FSD
      </span>
      <div className="relative z-10">
        <p className="text-brand-300 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em]">
          <span className="bg-brand-400 size-1.5 animate-pulse rounded-full" aria-hidden />
          LUCKY DRAW · 진행중
        </p>
        <p className="mt-2 text-sm leading-snug font-extrabold">
          테슬라 모델X(FSD)
          <br />
          1개월 사용권 추첨
        </p>
        <p className="text-static-white mt-2.5 inline-flex items-center gap-1 font-mono text-[11px] font-bold">
          응모하러 가기
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </p>
      </div>
    </Link>
  )
}
