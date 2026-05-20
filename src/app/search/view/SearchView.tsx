'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { IcoSearch } from '@/shared/components/icons'
import ParkingCard from '@/shared/components/ui/ParkingCard'

import { POPULAR_AREAS } from '@/shared/lib/constants'

import type { PopularParkingLot } from '@/shared/types/trace'

interface SearchViewProps {
  keyword: string
  areaKey: string | null
  areaLabel: string | null
  results: PopularParkingLot[]
}

export default function SearchView({ keyword, areaKey, areaLabel, results }: SearchViewProps) {
  const router = useRouter()
  const [input, setInput] = useState(keyword)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const k = input.trim()
    if (!k) return
    router.push(`/search?q=${encodeURIComponent(k)}`)
  }

  const heading = areaLabel ? `${areaLabel} 주차장` : keyword ? `'${keyword}' 검색 결과` : '주차장 찾기'

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 md:px-6 md:py-10">
      <h1 className="text-text-strong text-2xl font-bold md:text-3xl">{heading}</h1>

      <form onSubmit={onSubmit} className="mt-5 md:mt-7">
        <label className="border-stroke-sub focus-within:border-text-strong focus-within:ring-text-strong/20 flex h-12 max-w-xl items-center gap-2 rounded-full border bg-white px-4 transition-shadow focus-within:ring-2">
          <IcoSearch className="text-icon-strong size-5" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="주차장 이름 · 지역명으로 검색"
            className="placeholder:text-text-soft text-text-strong flex-1 bg-transparent text-sm outline-none md:text-base"
            aria-label="주차장 검색"
            autoFocus={!keyword && !areaKey}
          />
        </label>
      </form>

      {/* 지역 칩 (검색어 없을 때만 노출) */}
      {!keyword && !areaKey && (
        <section className="mt-8 md:mt-10">
          <h2 className="text-text-strong mb-3 text-sm font-semibold">지역으로 둘러보기</h2>
          <div className="flex flex-wrap gap-2">
            {POPULAR_AREAS.map((area) => (
              <Link
                key={area.key}
                href={`/search?area=${area.key}`}
                className="border-stroke-sub hover:border-text-strong hover:bg-bg-soft text-text-strong inline-flex h-9 items-center rounded-full border bg-white px-4 text-sm font-medium transition-colors"
              >
                {area.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 결과 */}
      {(keyword || areaKey) && (
        <section className="mt-6 md:mt-8">
          {results.length === 0 ? (
            <div className="border-stroke-soft bg-bg-weak rounded-2xl border px-6 py-16 text-center">
              <p className="text-text-strong text-base font-semibold">검색 결과가 없습니다</p>
              <p className="text-text-sub mt-2 text-sm">다른 검색어로 시도해보거나, 지역으로 둘러보세요.</p>
            </div>
          ) : (
            <>
              <p className="text-text-soft mb-4 text-sm">
                총 <span className="text-text-strong font-semibold tabular-nums">{results.length}</span>개의 주차장
              </p>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
                {results.map((p) => (
                  <li key={p.seq}>
                    <ParkingCard
                      seq={p.seq}
                      name={p.name}
                      address={p.address}
                      avgRating={p.avgRating}
                      totalReviewCount={p.totalReviewCount}
                      weeklyNewReviewCount={p.weeklyNewReviewCount}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </main>
  )
}
