'use client'

import { IcoClose, IcoExternal, IcoMapPin, IcoSearch } from '@/shared/components/icons'
import ParkingCard from '@/shared/components/ui/ParkingCard'

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

  const heading = trimmed.length >= 2 ? `'${trimmed}' 검색 결과` : '주차장 찾기'

  const showIdle = trimmed.length === 0
  const showEmpty = !loading && trimmed.length >= 2 && places.length === 0 && parkingLots.length === 0

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 md:px-6 md:py-10">
      <h1 className="text-text-strong text-2xl font-bold md:text-3xl">{heading}</h1>

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
        <section className="mt-6 md:mt-8">
          <header className="mb-4 flex items-end justify-between">
            <h2 className="text-text-strong text-lg font-bold">주차장</h2>
            <p className="text-text-soft text-xs tabular-nums">{parkingLots.length}개</p>
          </header>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {parkingLots.map((p, i) => (
              <li key={p.seq}>
                <ParkingCard data={p} index={i} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* POI(장소) 결과 — 클릭 시 모웹 /map?lat=&lng= 로 이동 */}
      {places.length > 0 && (
        <section className="mt-8 md:mt-10">
          <header className="mb-4 flex items-end justify-between">
            <h2 className="text-text-strong text-lg font-bold">장소</h2>
            <p className="text-text-soft text-xs tabular-nums">{places.length}개</p>
          </header>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {places.map((place, i) => {
              const host = process.env.NEXT_PUBLIC_WEBAPP_HOST ?? ''
              const href = `${host}/map?lat=${place.latitude}&lng=${place.longitude}`
              return (
                <li key={`${place.latitude}-${place.longitude}-${i}`}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-line bg-bg hover:border-fg hover:bg-brand-50 group flex h-full w-full items-start gap-3 border px-4 py-3.5 text-left transition-colors"
                  >
                    <span className="border-line-2 bg-bg text-fg inline-flex size-9 shrink-0 items-center justify-center border">
                      <IcoMapPin className="size-4" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-fg truncate text-sm font-bold tracking-tight md:text-[15px]">
                        {place.name}
                      </span>
                      <span className="text-fg-3 truncate font-mono text-[11px]">{place.address}</span>
                    </span>
                    <IcoExternal className="text-fg-3 group-hover:text-accent size-3.5 shrink-0 self-center transition-colors" />
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
