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
    <section className="bg-fg text-static-white border-fg border-[1.5px] px-6 py-10 text-center">
      <p className="font-mono text-[11px] tracking-[0.4em]">
        {badge} · {STATUS_LABEL[status]}
      </p>
      <h1 className="mt-4 text-[28px] leading-[1.25] font-extrabold tracking-[-0.02em] whitespace-pre-line">{title}</h1>
      <p className="mt-3 text-sm opacity-80">{subtitle}</p>
      <p className="mt-6 inline-block border-t border-dashed border-white/40 pt-3 font-mono text-xs opacity-70">
        {periodLabel}
      </p>
      {status === 'upcoming' && (
        <p className="border-static-white/60 text-static-white mx-auto mt-4 w-fit border border-dashed px-3 py-1 font-mono text-xs font-bold">
          6.22 오픈 — 곧 응모를 시작해요
        </p>
      )}
      {status === 'ended' && (
        <p className="bg-accent text-static-white mx-auto mt-4 w-fit px-3 py-1 font-mono text-xs font-bold">
          응모 마감 — 7.20 발표를 기다려주세요
        </p>
      )}
    </section>
  )
}
