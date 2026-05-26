'use client'

import Link from 'next/link'

import { IcoChevronRight, IcoClose, IcoExternal, IcoMapPin, IcoSearch } from '@/shared/components/icons'

import { isApiConfigured } from '@/shared/lib/apiClient'

import { useSearchViewModel } from '../viewmodel'
import type { PopularParkingLot } from '@/shared/types/trace'

interface SearchViewProps {
  initialKeyword: string
  initialKeywordResults: PopularParkingLot[]
}

export default function SearchView(props: SearchViewProps) {
  const { input, setInput, places, parkingLots, loading, submit, reset } = useSearchViewModel(props)
  const trimmed = input.trim()

  const isResults = trimmed.length >= 2

  const showIdle = trimmed.length === 0
  const showEmpty = !loading && isResults && places.length === 0 && parkingLots.length === 0
  const totalHits = parkingLots.length + places.length

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 md:px-6 md:py-10">
      <div className="flex items-baseline gap-3">
        <p className="text-fg-3 font-mono text-[11px] tracking-[0.18em] uppercase">
          {isResults ? '검색 결과 · Search' : '검색 · Search'}
        </p>
        {isResults && !loading && (
          <span className="text-fg-3 font-mono text-[11px] tabular-nums">— {totalHits} HITS</span>
        )}
      </div>
      <h1 className="text-fg mt-1 text-2xl font-bold tracking-tight md:text-3xl">
        {isResults ? (
          <>
            <span className="text-accent">‘{trimmed}’</span>
            <span className="text-fg-2"> 검색 결과</span>
          </>
        ) : (
          '주차장 찾기'
        )}
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(input)
        }}
        className="mt-5 md:mt-7"
      >
        <label className="border-stroke-sub focus-within:border-brand-500 focus-within:ring-brand-100 flex h-12 max-w-xl items-center gap-2 rounded-full border-2 bg-white px-4 transition-shadow focus-within:ring-4">
          <IcoSearch className="text-brand-500 size-5" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="주차장 이름 · 지역명으로 검색"
            className="placeholder:text-text-soft text-text-strong flex-1 bg-transparent text-sm outline-none md:text-base"
            aria-label="주차장 검색"
            autoFocus={showIdle}
          />
          {input.length > 0 && (
            <button
              type="button"
              onClick={reset}
              aria-label="검색어 지우기"
              className="text-icon-soft hover:text-icon-strong -mr-1 p-1"
            >
              <IcoClose className="size-4" />
            </button>
          )}
        </label>
        {trimmed.length === 1 && <p className="text-text-soft mt-2 text-xs">두 글자 이상 입력하면 검색돼요.</p>}
      </form>

      {/* idle 안내 */}
      {showIdle && <p className="text-text-soft mt-10 text-sm">주차장 이름이나 지역명을 검색해보세요.</p>}

      {/* 검색 중 */}
      {loading && (
        <p className="text-text-soft mt-6 text-sm" role="status">
          검색 중...
        </p>
      )}

      {/* 주차장 결과 (Trace 핵심) */}
      {parkingLots.length > 0 && (
        <section className="mt-8 md:mt-10">
          <header className="border-fg mb-3 flex items-baseline justify-between border-b pb-2">
            <h2 className="text-fg font-mono text-[12px] font-semibold tracking-[0.14em] uppercase">
              Parking <span className="text-fg-3">·</span> 주차장
            </h2>
            <p className="text-fg-3 font-mono text-[11px] tabular-nums">{parkingLots.length} HITS</p>
          </header>
          <ul className="divide-line border-line flex flex-col divide-y border-b">
            {parkingLots.map((p, i) => (
              <li key={p.seq}>
                <SearchParkingRow lot={p} index={i} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* POI(장소) 결과 — 클릭 시 모웹 /map?lat=&lng= 로 이동 */}
      {places.length > 0 && (
        <section className="mt-10 md:mt-12">
          <header className="border-fg mb-3 flex items-baseline justify-between border-b pb-2">
            <h2 className="text-fg font-mono text-[12px] font-semibold tracking-[0.14em] uppercase">
              Places <span className="text-fg-3">·</span> 장소
            </h2>
            <p className="text-fg-3 font-mono text-[11px] tabular-nums">{places.length} HITS</p>
          </header>
          <ul className="divide-line border-line flex flex-col divide-y border-b">
            {places.map((place, i) => {
              const host = process.env.NEXT_PUBLIC_WEBAPP_HOST ?? ''
              const href = `${host}/map?lat=${place.latitude}&lng=${place.longitude}`
              return (
                <li key={`${place.latitude}-${place.longitude}-${i}`}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group hover:bg-brand-50 flex w-full items-center gap-3 px-3 py-3 text-left transition-colors md:px-4 md:py-3.5"
                  >
                    <span className="text-fg-3 group-hover:text-accent shrink-0">
                      <IcoMapPin className="size-4" />
                    </span>
                    <span className="flex min-w-0 flex-1 items-baseline gap-3">
                      <span className="text-fg truncate text-[14px] font-semibold tracking-tight md:text-[15px]">
                        {place.name}
                      </span>
                      <span className="text-fg-3 truncate font-mono text-[11px]">{place.address}</span>
                    </span>
                    <IcoExternal className="text-fg-4 group-hover:text-accent size-3.5 shrink-0 transition-colors" />
                  </a>
                </li>
              )
            })}
          </ul>
          <p className="text-fg-3 mt-3 font-mono text-[11px] tracking-[0.06em] uppercase">
            ↗ 모두의주차장 지도로 이동합니다
          </p>
        </section>
      )}

      {/* 결과 없음 */}
      {showEmpty && (
        <div className="border-stroke-soft bg-bg-weak mt-6 rounded-2xl border px-6 py-16 text-center">
          <p className="text-text-strong text-base font-semibold">검색 결과가 없습니다</p>
          <p className="text-text-sub mt-2 text-sm">
            다른 검색어로 시도해보세요.
            {!isApiConfigured && (
              <>
                <br />
                <span className="text-text-soft text-xs">
                  (장소 검색은 NEXT_PUBLIC_MODU_API_HOST 환경변수가 필요해요)
                </span>
              </>
            )}
          </p>
        </div>
      )}
    </main>
  )
}

function SearchParkingRow({ lot, index }: { lot: PopularParkingLot; index: number }) {
  const stagger = Math.min(index * 28, 240)
  const fillPct = (Math.max(0, Math.min(5, lot.avgRating)) / 5) * 100
  const hasReviews = lot.totalReviewCount > 0
  const code = `P${lot.seq}.${String(lot.totalReviewCount).padStart(4, '0')}`

  return (
    <Link
      href={`/p/${lot.seq}`}
      className="group hover:bg-brand-50 flex w-full flex-col gap-1.5 px-3 py-3.5 transition-colors motion-safe:animate-[fadeUp_0.45s_ease-out_both] md:grid md:grid-cols-[minmax(0,1fr)_auto_16px] md:items-center md:gap-x-5 md:px-4 md:py-4"
      style={{ animationDelay: `${stagger}ms` }}
    >
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-fg group-hover:text-brand-700 truncate text-[15px] font-bold tracking-tight transition-colors md:text-base">
          {lot.name}
        </span>
        <span className="text-fg-3 flex items-center gap-1 truncate font-mono text-[11px]">
          <IcoMapPin className="size-3 shrink-0" />
          <span className="truncate">{lot.address}</span>
          <span aria-hidden className="text-fg-4">
            ·
          </span>
          <span className="tracking-[0.04em]">{code}</span>
        </span>
      </span>

      <span className="flex items-center gap-3 whitespace-nowrap tabular-nums">
        <span
          className="relative inline-block text-[13px] leading-none"
          aria-label={hasReviews ? `평균 별점 ${lot.avgRating.toFixed(1)}` : '후기 없음'}
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
        <span className="text-fg text-[13px] font-bold tabular-nums">
          {hasReviews ? lot.avgRating.toFixed(1) : '–'}
        </span>
        <span className="bg-line-2 hidden h-3 w-px sm:inline-block" aria-hidden />
        <span className="text-fg-2 hidden font-mono text-[11px] sm:inline">
          후기 <span className="text-fg font-semibold">{lot.totalReviewCount}</span>
        </span>
        {(lot.recommendUpCount ?? 0) > 0 && (
          <>
            <span className="bg-line-2 hidden h-3 w-px md:inline-block" aria-hidden />
            <span className="text-accent-700 hidden font-mono text-[11px] font-semibold md:inline">
              👍 {lot.recommendUpCount}
            </span>
          </>
        )}
      </span>

      <IcoChevronRight className="text-fg-3 group-hover:text-accent hidden size-4 transition-transform group-hover:translate-x-1 md:inline" />
    </Link>
  )
}
