'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { IcoChevronRight, IcoSearch } from '@/shared/components/icons'
import ParkingCard from '@/shared/components/ui/ParkingCard'

import { POPULAR_AREAS } from '@/shared/lib/constants'

import type { PopularParkingLot } from '@/shared/types/trace'

interface HomeViewProps {
  popular: PopularParkingLot[]
}

export default function HomeView({ popular }: HomeViewProps) {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const k = keyword.trim()
    if (!k) return
    router.push(`/search?q=${encodeURIComponent(k)}`)
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 md:px-6">
      <section className="pt-10 pb-8 md:pt-20 md:pb-14">
        <h1 className="text-text-strong text-3xl leading-tight font-bold tracking-tight md:text-5xl md:leading-[1.15]">
          가본 사람만 남기는
          <br />
          주차장 흔적
        </h1>
        <p className="text-text-sub mt-3 max-w-xl text-sm md:mt-4 md:text-base">
          주차권을 직접 사용한 운전자만 글을 남길 수 있는 익명 리뷰 플랫폼.
          <br className="hidden md:inline" />
          광고도, 영업도 없는 진짜 흔적만 모았어요.
        </p>

        <form onSubmit={onSubmit} className="mt-7 md:mt-10">
          <label className="border-stroke-sub focus-within:border-text-strong focus-within:ring-text-strong/20 flex h-14 max-w-2xl items-center gap-3 rounded-full border bg-white px-5 transition-shadow focus-within:shadow-[var(--shadow-02)] focus-within:ring-2 md:h-16">
            <IcoSearch className="text-icon-strong size-5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="주차장 이름 · 지역명으로 검색"
              className="placeholder:text-text-soft text-text-strong flex-1 bg-transparent text-base outline-none md:text-lg"
              aria-label="주차장 검색"
            />
            <button
              type="submit"
              className="bg-brand-900 hover:bg-brand-700 active:bg-brand-950 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-40"
              disabled={!keyword.trim()}
            >
              검색
            </button>
          </label>
        </form>
      </section>

      <section className="py-8 md:py-10">
        <div className="mb-5 flex items-end justify-between md:mb-6">
          <div>
            <h2 className="text-text-strong text-xl font-bold md:text-2xl">이번 주 흔적이 쌓인 곳</h2>
            <p className="text-text-soft mt-1 text-xs md:text-sm">최근 7일 동안 새 흔적이 가장 많이 등록된 주차장</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {popular.map((p) => (
            <ParkingCard
              key={p.seq}
              seq={p.seq}
              name={p.name}
              address={p.address}
              avgRating={p.avgRating}
              totalReviewCount={p.totalReviewCount}
              weeklyNewReviewCount={p.weeklyNewReviewCount}
            />
          ))}
        </div>
      </section>

      <section className="py-8 md:py-10">
        <h2 className="text-text-strong mb-5 text-xl font-bold md:mb-6 md:text-2xl">지역으로 둘러보기</h2>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {POPULAR_AREAS.map((area) => (
            <Link
              key={area.key}
              href={`/search?area=${area.key}`}
              className="border-stroke-sub hover:border-text-strong hover:bg-bg-soft text-text-strong inline-flex h-10 items-center gap-1 rounded-full border bg-white px-4 text-sm font-medium transition-colors md:h-11 md:px-5 md:text-base"
            >
              {area.label}
              <IcoChevronRight className="text-icon-soft size-3.5" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
