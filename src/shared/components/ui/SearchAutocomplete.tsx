'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { IcoChevronRight, IcoClose, IcoExternal, IcoMapPin, IcoSearch, IcoStar } from '@/shared/components/icons'
import useDebounce from '@/shared/hooks/useDebounce'
import { useRecentSearches } from '@/shared/hooks/useRecentSearches'

import { formatRating } from '@/shared/lib/format'
import { fetchSearchPlace, type SearchPlace } from '@/shared/lib/poi'

import type { PopularParkingLot } from '@/shared/types/trace'

import { searchParkingLotsWithStats } from '@/shared/mocks/api'

export type AutocompleteVariant = 'hero' | 'header'

interface SearchAutocompleteProps {
  variant?: AutocompleteVariant
  placeholder?: string
  initialKeyword?: string
}

const STYLES: Record<AutocompleteVariant, { wrap: string; icon: string; input: string; submit?: string }> = {
  hero: {
    wrap: 'h-14 rounded-2xl border-2 border-line-2 px-5 md:h-[68px]',
    icon: 'size-5',
    input: 'text-[16px] md:text-lg',
    submit:
      'bg-brand-500 hover:bg-brand-700 active:bg-brand-900 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-colors disabled:opacity-30'
  },
  header: {
    wrap: 'h-10 rounded-none border border-fg px-3.5 shadow-[2px_2px_0_var(--color-fg)]',
    icon: 'size-4',
    // 16px 유지 — iOS Safari focus 시 zoom-in 방지
    input: 'text-[16px]'
  }
}

export default function SearchAutocomplete({
  variant = 'hero',
  placeholder,
  initialKeyword = ''
}: SearchAutocompleteProps) {
  const router = useRouter()
  const { searches, refresh, remove } = useRecentSearches()
  const [input, setInput] = useState(initialKeyword)
  const debounced = useDebounce(input, 300)
  const [isOpen, setIsOpen] = useState(false)
  const [places, setPlaces] = useState<SearchPlace[]>([])
  const [parkingLots, setParkingLots] = useState<PopularParkingLot[]>([])
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const style = STYLES[variant]
  const trimmed = debounced.trim()

  // outside click → close
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setIsOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  // 검색 (debounce 후)
  useEffect(() => {
    if (trimmed.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlaces([])
      setParkingLots([])
      return
    }
    let cancelled = false

    setLoading(true)
    Promise.all([fetchSearchPlace(trimmed), searchParkingLotsWithStats(trimmed)]).then(([poi, lots]) => {
      if (cancelled) return
      setPlaces(poi.slice(0, 4))
      setParkingLots(lots.slice(0, 5))
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [trimmed])

  const goSearch = (q: string) => {
    const k = q.trim()
    if (!k) return
    setIsOpen(false)
    router.push(`/search?q=${encodeURIComponent(k)}`)
  }

  const onFocus = () => {
    refresh()
    setIsOpen(true)
  }

  const showRecent = trimmed.length === 0 && searches.length > 0
  const showResults = trimmed.length >= 2
  const showEmpty = showResults && !loading && places.length === 0 && parkingLots.length === 0

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          goSearch(input)
        }}
      >
        <label className={`flex items-center gap-3 bg-white ${style.wrap}`}>
          <IcoSearch className={`text-brand-500 ${style.icon}`} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={onFocus}
            placeholder={placeholder ?? '주차장 이름·지역명으로 검색'}
            className={`placeholder:text-text-soft text-text-strong flex-1 bg-transparent outline-none ${style.input}`}
            aria-label="주차장 검색"
            aria-autocomplete="list"
          />
          {input.length > 0 && (
            <button
              type="button"
              onClick={() => setInput('')}
              aria-label="검색어 지우기"
              className="text-icon-soft hover:text-icon-strong -mx-1 p-1"
            >
              <IcoClose className="size-4" />
            </button>
          )}
          {variant === 'hero' && (
            <button type="submit" className={style.submit!} disabled={!input.trim()}>
              검색
            </button>
          )}
        </label>
      </form>

      {/* Dropdown panel */}
      {isOpen && (showRecent || showResults) && (
        <div
          role="listbox"
          className="border-fg bg-bg absolute top-full right-0 left-0 z-50 mt-1.5 max-h-[min(560px,calc(100dvh-160px))] overflow-y-auto border shadow-[3px_3px_0_var(--color-fg)]"
        >
          {/* 최근 검색 */}
          {showRecent && (
            <section className="py-2">
              <header className="text-text-soft px-4 py-2 text-[11px] font-bold tracking-wider uppercase">
                최근 검색
              </header>
              <ul>
                {searches.slice(0, 6).map((k) => (
                  <li key={k} className="hover:bg-bg-weak flex items-center pr-2 transition-colors">
                    <button
                      type="button"
                      onClick={() => goSearch(k)}
                      className="flex min-w-0 flex-1 items-center gap-3 px-4 py-2.5 text-left"
                    >
                      <span className="text-icon-soft inline-flex size-7 shrink-0 items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                          <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </span>
                      <span className="text-text-strong truncate text-sm">{k}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        remove(k)
                        refresh()
                      }}
                      aria-label={`${k} 삭제`}
                      className="text-icon-soft hover:bg-bg-soft hover:text-icon-strong inline-flex size-7 items-center justify-center rounded-full"
                    >
                      <IcoClose className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 로딩 */}
          {showResults && loading && (
            <div className="text-text-soft px-4 py-8 text-center text-sm" role="status">
              검색 중...
            </div>
          )}

          {/* 주차장 결과 */}
          {showResults && !loading && parkingLots.length > 0 && (
            <section className="py-2">
              <header className="text-text-soft px-4 py-2 text-[11px] font-bold tracking-wider uppercase">
                주차장 {parkingLots.length}
              </header>
              <ul>
                {parkingLots.map((p) => (
                  <li key={p.seq}>
                    <Link
                      href={`/p/${p.seq}`}
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-bg-weak group flex items-center gap-3 px-4 py-2.5 transition-colors"
                    >
                      <span className="bg-brand-50 text-brand-700 inline-flex size-9 shrink-0 items-center justify-center rounded-xl">
                        <IcoMapPin className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="text-text-strong block truncate text-sm font-semibold">{p.name}</span>
                        <span className="text-text-soft block truncate text-xs">{p.address}</span>
                      </span>
                      <span className="text-text-sub flex shrink-0 items-center gap-1 text-xs tabular-nums">
                        <IcoStar className="text-star size-3" filled />
                        <span className="font-bold">{p.totalReviewCount > 0 ? formatRating(p.avgRating) : '-'}</span>
                        <span className="text-text-soft">· {p.totalReviewCount}</span>
                      </span>
                      <IcoChevronRight className="text-icon-soft size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 장소 결과 (POI) */}
          {showResults && !loading && places.length > 0 && (
            <section className="border-stroke-soft border-t py-2">
              <header className="text-text-soft px-4 py-2 text-[11px] font-bold tracking-wider uppercase">
                장소 {places.length}
              </header>
              <ul>
                {places.map((place, i) => (
                  <li key={`${place.latitude}-${place.longitude}-${i}`}>
                    <a
                      href={`https://map.naver.com/v5/search/${encodeURIComponent(place.name)}?lng=${place.longitude}&lat=${place.latitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:bg-bg-weak flex items-center gap-3 px-4 py-2.5 transition-colors"
                    >
                      <span className="bg-bg-soft text-icon-sub inline-flex size-9 shrink-0 items-center justify-center rounded-xl">
                        <IcoMapPin className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="text-text-strong block truncate text-sm">{place.name}</span>
                        <span className="text-text-soft block truncate text-xs">{place.address}</span>
                      </span>
                      <IcoExternal className="text-icon-soft size-3.5 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 빈 결과 */}
          {showEmpty && (
            <div className="px-4 py-10 text-center">
              <p className="text-text-strong text-sm font-semibold">관련 결과가 없어요</p>
              <p className="text-text-soft mt-1 text-xs">Enter를 누르면 전체 검색 페이지로 이동해요</p>
            </div>
          )}

          {/* 전체 검색 진입 */}
          {showResults && !loading && (parkingLots.length > 0 || places.length > 0) && (
            <button
              type="button"
              onClick={() => goSearch(input)}
              className="border-stroke-soft text-text-sub hover:bg-bg-weak hover:text-brand-700 flex w-full items-center justify-center gap-1 border-t px-4 py-3 text-xs font-bold transition-colors"
            >
              &lsquo;{trimmed}&rsquo; 전체 검색 결과 보기
              <IcoChevronRight className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
