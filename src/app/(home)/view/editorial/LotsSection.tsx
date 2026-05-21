'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import type { PopularParkingLot } from '@/shared/types/trace'

interface LotsSectionProps {
  lots: PopularParkingLot[]
}

type SortKey = 'hot' | 'new' | 'rating'

export default function LotsSection({ lots }: LotsSectionProps) {
  const [sort, setSort] = useState<SortKey>('hot')

  const sorted = useMemo(() => {
    if (sort === 'hot')
      return [...lots].sort((a, b) => Number(b.hot) - Number(a.hot) || b.totalReviewCount - a.totalReviewCount)
    if (sort === 'new') return [...lots].sort((a, b) => Number(b.seq) - Number(a.seq))
    return [...lots].sort((a, b) => b.avgRating - a.avgRating)
  }, [lots, sort])

  return (
    <section className="border-line border-b">
      <div className="mx-auto max-w-[1200px] px-6 py-11">
        <header className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-fg flex items-center gap-2 font-mono text-[13px] font-semibold tracking-[0.02em] uppercase">
            <Image src="/icons/icn_parking_best.webp" alt="" width={20} height={20} aria-hidden className="shrink-0" />
            This Week`s Hot 주차장
          </h2>
          <nav className="text-fg-3 flex gap-3.5 font-mono text-[11px]">
            <SortBtn active={sort === 'hot'} onClick={() => setSort('hot')}>
              HOT
            </SortBtn>
            <SortBtn active={sort === 'new'} onClick={() => setSort('new')}>
              NEW
            </SortBtn>
            <SortBtn active={sort === 'rating'} onClick={() => setSort('rating')}>
              ★
            </SortBtn>
          </nav>
        </header>

        <div className="border-fg flex flex-col border-y-2">
          {sorted.map((lot, i) => (
            <LotRow key={lot.seq} lot={lot} rank={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function LotRow({ lot, rank }: { lot: PopularParkingLot; rank: number }) {
  const fillPct = (Math.max(0, Math.min(5, lot.avgRating)) / 5) * 100
  return (
    <Link
      href={`/p/${lot.seq}`}
      className="border-line group hover:bg-brand-50 flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-4 py-3 last:border-b-0 md:grid md:grid-cols-[32px_minmax(0,1fr)_auto_auto_auto_16px] md:gap-x-4 md:py-3.5"
    >
      <span className="text-fg-3 w-7 shrink-0 font-mono text-[11px] tabular-nums">{String(rank).padStart(2, '0')}</span>
      <span className="text-fg basis-full truncate text-[15px] font-bold tracking-tight md:basis-auto">{lot.name}</span>
      <span className="ml-auto inline-flex items-center gap-1.5 whitespace-nowrap tabular-nums md:ml-0">
        <span
          className="relative inline-block text-[13px] leading-none"
          aria-label={`평균 별점 ${lot.avgRating.toFixed(1)}`}
        >
          <span className="text-fg-4">★★★★★</span>
          <span
            className="text-caution-500 absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap"
            style={{ width: `${fillPct}%` }}
            aria-hidden
          >
            ★★★★★
          </span>
        </span>
        <span className="text-fg ml-1 text-[13px] font-bold">{lot.avgRating.toFixed(1)}</span>
      </span>
      <span className="text-fg-2 font-mono text-xs whitespace-nowrap tabular-nums">{lot.totalReviewCount}건</span>
      <span className="text-fg-3 hidden font-mono text-[11px] whitespace-nowrap tabular-nums md:inline">
        ↻ {lot.revisitRatePct ?? 0}%
      </span>
      <span className="text-fg-3 group-hover:text-accent ml-2 text-right text-sm md:ml-0">→</span>
    </Link>
  )
}

function SortBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`transition-colors ${active ? 'text-fg' : 'text-fg-3 hover:text-fg-2'}`}
    >
      {children}
    </button>
  )
}
