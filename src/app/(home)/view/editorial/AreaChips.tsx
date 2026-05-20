import Link from 'next/link'

import { AREAS } from '@/shared/mocks/parkingLots'

interface AreaChipsProps {
  totalLots: number
}

export default function AreaChips({ totalLots }: AreaChipsProps) {
  return (
    <section className="border-line border-b">
      <div className="mx-auto max-w-[1200px] px-6 py-11">
        <header className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-fg flex items-center gap-2.5 font-mono text-[13px] font-semibold tracking-[0.02em] uppercase">
            <span className="text-accent">§</span>지역
          </h2>
          <span className="text-fg-3 font-mono text-[11px]">{AREAS.length}개 지역 · 누적 1,049건</span>
        </header>
        <div className="flex flex-wrap gap-2">
          {/* 전체는 home에 머무름 — 활성 상태 표기 */}
          <span className="bg-fg text-bg border-fg inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] whitespace-nowrap">
            전체
            <span className="text-bg-3 font-mono text-[10px] opacity-70">{totalLots}</span>
          </span>
          {AREAS.map((a) => (
            <Link
              key={a.key}
              href={`/search?q=${encodeURIComponent(a.label)}`}
              className="border-line bg-bg text-fg-2 hover:text-fg hover:border-fg-3 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] whitespace-nowrap transition-all"
            >
              {a.label}
              <span className="text-fg-3 font-mono text-[10px]">{a.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
