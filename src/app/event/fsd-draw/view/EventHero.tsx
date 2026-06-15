'use client'

import Image from 'next/image'
import Link from 'next/link'

import type { EventStatus } from '@/shared/types/event'

const STATUS_LABEL: Record<EventStatus, string> = {
  upcoming: 'OPENS SOON',
  active: 'NOW OPEN',
  ended: 'CLOSED'
}

// 텍스트(상단)·CTA(하단)는 어둡게, 가운데 차량은 또렷하게 — 빈 검은 띠 없이 한 장의 비주얼로.
const SCRIM =
  'linear-gradient(to bottom, rgba(23,23,23,0.96) 0%, rgba(23,23,23,0.84) 25%, rgba(23,23,23,0.4) 47%, rgba(23,23,23,0.28) 64%, rgba(23,23,23,0.62) 83%, rgba(23,23,23,0.94) 100%)'

interface EventHeroProps {
  status: EventStatus
  badge: string
  title: string
  subtitle: string
  periodLabel: string
  canRender: boolean
  isLoggedIn: boolean
  hasEntered: boolean
  myTickets: number
  loginHref: string
  onEnter: () => void
}

const CTA_BASE = 'border-fg block w-full border-[1.5px] px-5 py-3.5 text-center text-sm font-bold transition-transform'

export default function EventHero({
  status,
  badge,
  title,
  subtitle,
  periodLabel,
  canRender,
  isLoggedIn,
  hasEntered,
  myTickets,
  loginHref,
  onEnter
}: EventHeroProps) {
  const active = status === 'active'

  function renderCta() {
    if (!active) {
      return (
        <div className={`${CTA_BASE} border-static-white/30 text-static-white/60 cursor-default`}>
          {status === 'upcoming' ? '6.22 오픈 예정' : '응모가 마감되었어요 · 7.20 발표'}
        </div>
      )
    }
    // SSR/하이드레이션 전 + 비로그인 → 동일하게 로그인 유도 (mismatch 회피)
    if (!canRender || !isLoggedIn) {
      return (
        <Link
          href={loginHref}
          className={`${CTA_BASE} bg-accent text-static-white hover:-translate-y-px`}
          style={{ boxShadow: '3px 3px 0 var(--color-static-white)' }}
        >
          로그인하고 응모하기
        </Link>
      )
    }
    if (!hasEntered) {
      return (
        <button
          type="button"
          onClick={onEnter}
          className={`${CTA_BASE} evt-live bg-accent text-static-white hover:-translate-y-px`}
          style={{ boxShadow: '3px 3px 0 var(--color-static-white)' }}
        >
          응모하기 — 응모권 1장 받기
        </button>
      )
    }
    return (
      <div
        className={`${CTA_BASE} bg-static-white text-fg flex items-center justify-center gap-2`}
        style={{ boxShadow: '3px 3px 0 var(--color-accent)' }}
      >
        <span className="bg-accent size-1.5 rounded-full" aria-hidden />
        응모 완료 · {myTickets}장으로 참여 중
      </div>
    )
  }

  return (
    <section className="border-fg bg-fg text-static-white relative flex min-h-[600px] flex-col overflow-hidden border-[1.5px]">
      {/* 풀블리드 테슬라 사진 — ken-burns 줌, 차량이 중앙~하단을 채우도록 object-position 조정 */}
      <Image
        src="/event/tesla-modelx.jpg"
        alt="테슬라 모델X — FSD 1개월 사용권 경품"
        fill
        priority
        sizes="(max-width: 680px) 100vw, 680px"
        className="evt-hero-img object-cover"
        style={{ objectPosition: 'center 72%' }}
      />
      <span className="pointer-events-none absolute inset-0" style={{ background: SCRIM }} aria-hidden />
      <span className="evt-sheen z-20" aria-hidden />

      {/* 콘텐츠 — 텍스트는 위, CTA는 mt-auto로 하단 고정 */}
      <div className="relative z-10 flex flex-1 flex-col px-6 pt-9 pb-7 text-center">
        <p className="evt-rise font-mono text-[11px] tracking-[0.4em]">{badge}</p>

        <p
          className={`evt-rise mx-auto mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.18em] ${
            active
              ? 'evt-live bg-accent text-static-white'
              : 'border-static-white/40 text-static-white/80 border border-dashed'
          }`}
          style={{ animationDelay: '0.06s' }}
        >
          {active && <span className="bg-static-white size-1.5 rounded-full" aria-hidden />}
          {STATUS_LABEL[status]}
        </p>

        <h1
          className="evt-rise mt-4 text-[28px] leading-[1.25] font-extrabold tracking-[-0.02em] whitespace-pre-line"
          style={{ animationDelay: '0.12s' }}
        >
          {title}
        </h1>
        <p className="evt-rise mt-3 text-sm opacity-85" style={{ animationDelay: '0.18s' }}>
          {subtitle}
        </p>
        <p
          className="evt-rise mt-5 inline-block self-center border-t border-dashed border-white/40 pt-3 font-mono text-xs opacity-75"
          style={{ animationDelay: '0.24s' }}
        >
          {periodLabel}
        </p>

        <div className="evt-rise mt-auto pt-9" style={{ animationDelay: '0.3s' }}>
          {renderCta()}
        </div>
      </div>
    </section>
  )
}
