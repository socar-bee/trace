'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { StarRatingDisplay } from '@/shared/components/ui/StarRating'
import TagPill from '@/shared/components/ui/Tag'

import { formatRelativeTime, formatVisitWindow } from '@/shared/lib/format'
import { getMyReviews } from '@/shared/lib/trace-storage'

import type { Review } from '@/shared/types/trace'

import { findParkingLotBySeq } from '@/shared/mocks/parkingLots'

export default function MyTracesView() {
  const [mounted, setMounted] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    // localStorage는 client-only이므로 mount 후에 동기화한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReviews(getMyReviews())
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-10 md:px-6" aria-busy>
        <h1 className="text-text-strong text-2xl font-bold md:text-3xl">내 흔적</h1>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 md:px-6 md:py-10">
      <header className="mb-6 md:mb-10">
        <h1 className="text-text-strong text-2xl font-bold md:text-3xl">내 흔적</h1>
        <p className="text-text-sub mt-1 text-sm">
          내가 남긴 주차장 흔적 <span className="font-semibold tabular-nums">{reviews.length}</span>건
        </p>
      </header>

      {reviews.length === 0 ? (
        <div className="border-stroke-soft bg-bg-weak rounded-2xl border px-6 py-16 text-center">
          <p className="text-text-strong text-base font-semibold">아직 남긴 흔적이 없어요</p>
          <p className="text-text-sub mt-2 text-sm">
            모두의주차장 앱에서 주차권을 사용한 뒤, 영수증의 「Trace 남기기」 버튼으로 흔적을 남길 수 있어요.
          </p>
          <Link
            href="/"
            className="bg-brand-900 text-static-white mt-6 inline-flex rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          >
            Trace 둘러보기
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3 md:gap-4">
          {reviews.map((r) => {
            const lot = findParkingLotBySeq(r.parkingLotSeq)
            return (
              <li key={r.id}>
                <Link
                  href={`/p/${r.parkingLotSeq}`}
                  className="group border-stroke-soft hover:border-stroke-sub flex flex-col gap-3 rounded-2xl border bg-white p-5 transition-colors md:p-6"
                >
                  <header className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-text-strong text-base font-semibold md:text-lg">{lot?.name ?? '주차장'}</p>
                      <p className="text-text-soft mt-1 text-xs">
                        {formatVisitWindow(r.enterTime, r.exitTime)} · {formatRelativeTime(r.createdAt)}
                      </p>
                    </div>
                    <StarRatingDisplay value={r.rating} size={14} />
                  </header>

                  {r.content && <p className="text-text-sub line-clamp-3 text-sm leading-relaxed">{r.content}</p>}

                  {r.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {r.tags.map((t) => (
                        <TagPill key={t} tag={t} />
                      ))}
                    </div>
                  )}

                  <p className="text-text-soft text-xs">
                    닉네임 · <span className="text-text-sub font-medium">{r.nickname}</span>
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
