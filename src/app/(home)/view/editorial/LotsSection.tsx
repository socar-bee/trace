'use client'

import { useMemo, useState } from 'react'

import type { PopularParkingLot } from '@/shared/types/trace'

import LotCardEditorial from './LotCardEditorial'

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
          <h2 className="text-fg flex items-center gap-2.5 font-mono text-[13px] font-semibold tracking-[0.02em] uppercase">
            <span className="text-accent">§</span>이번 주 후기가 쌓이는 곳
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {sorted.map((lot, i) => (
            <LotCardEditorial key={lot.seq} lot={lot} rank={i + 1} />
          ))}
        </div>
      </div>
    </section>
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
