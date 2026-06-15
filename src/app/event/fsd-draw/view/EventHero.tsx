import Image from 'next/image'

import type { EventStatus } from '@/shared/types/event'

const STATUS_LABEL: Record<EventStatus, string> = {
  upcoming: 'OPENS SOON',
  active: 'NOW OPEN',
  ended: 'CLOSED'
}

interface EventHeroProps {
  status: EventStatus
  badge: string
  title: string
  subtitle: string
  periodLabel: string
}

export default function EventHero({ status, badge, title, subtitle, periodLabel }: EventHeroProps) {
  return (
    <section className="border-fg bg-fg text-static-white relative overflow-hidden border-[1.5px]">
      {/* 광택 스윕 — 카드 위를 주기적으로 쓸고 지나감 */}
      <span className="evt-sheen z-20" aria-hidden />

      {/* 텍스트 블록 */}
      <div className="relative z-10 px-6 pt-9 text-center">
        <p className="evt-rise font-mono text-[11px] tracking-[0.4em]">{badge}</p>

        <p
          className={`evt-rise mx-auto mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.18em] ${
            status === 'active'
              ? 'evt-live bg-accent text-static-white'
              : 'border-static-white/40 text-static-white/80 border border-dashed'
          }`}
          style={{ animationDelay: '0.06s' }}
        >
          {status === 'active' && <span className="bg-static-white size-1.5 rounded-full" aria-hidden />}
          {STATUS_LABEL[status]}
        </p>

        <h1
          className="evt-rise mt-4 text-[28px] leading-[1.25] font-extrabold tracking-[-0.02em] whitespace-pre-line"
          style={{ animationDelay: '0.12s' }}
        >
          {title}
        </h1>
        <p className="evt-rise mt-3 text-sm opacity-80" style={{ animationDelay: '0.18s' }}>
          {subtitle}
        </p>
        <p
          className="evt-rise mt-5 inline-block border-t border-dashed border-white/40 pt-3 font-mono text-xs opacity-70"
          style={{ animationDelay: '0.24s' }}
        >
          {periodLabel}
        </p>
      </div>

      {/* 테슬라 사진 — ken-burns 줌 + 상단 그라데이션 블렌드로 텍스트와 자연스럽게 이어짐 */}
      <div className="relative mt-5 h-[210px] sm:h-[260px]">
        <Image
          src="/event/tesla-modelx.jpg"
          alt="테슬라 모델X — FSD 1개월 사용권 경품"
          fill
          priority
          sizes="(max-width: 680px) 100vw, 680px"
          className="evt-hero-img object-cover object-center"
        />
        {/* 상단을 hero 배경색으로 녹이고, 하단에 살짝 비네팅 */}
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, var(--color-fg) 0%, rgba(23,23,23,0.55) 24%, rgba(23,23,23,0.06) 52%, rgba(23,23,23,0.12) 78%, rgba(23,23,23,0.5) 100%)'
          }}
          aria-hidden
        />
      </div>

      {status === 'upcoming' && (
        <p className="border-static-white/60 text-static-white relative z-10 mx-auto -mt-2 mb-6 w-fit border border-dashed px-3 py-1 font-mono text-xs font-bold">
          6.22 오픈 — 곧 응모를 시작해요
        </p>
      )}
      {status === 'ended' && (
        <p className="bg-accent text-static-white relative z-10 mx-auto -mt-2 mb-6 w-fit px-3 py-1 font-mono text-xs font-bold">
          응모 마감 — 7.20 발표를 기다려주세요
        </p>
      )}
    </section>
  )
}
