'use client'

import { useEffect, useState } from 'react'

import type { Review, ReviewSortOrder } from '@/shared/types/trace'

import { fetchParkingLotDetail } from '@/shared/mocks/api'

import ReportDialog from './ReportDialog'
import ReviewCard from './ReviewCard'

interface ReviewListProps {
  seq: string
  initialReviews: Review[]
  initialHasNext: boolean
  totalCount: number
}

const PAGE_SIZE = 8

export default function ReviewList({ seq, initialReviews, initialHasNext, totalCount }: ReviewListProps) {
  const [sort, setSort] = useState<ReviewSortOrder>('recent')
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(initialHasNext)
  const [loading, setLoading] = useState(false)
  const [reportTarget, setReportTarget] = useState<Review | null>(null)

  // SSR이 보내준 첫 페이지 그대로 사용. sort/page가 바뀌면 클라이언트에서 다시 가져온다.
  const isInitial = sort === 'recent' && page === 1
  useEffect(() => {
    if (isInitial) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    fetchParkingLotDetail(seq, { sort, page, pageSize: PAGE_SIZE }).then((res) => {
      if (cancelled || !res) return
      setReviews(res.reviews)
      setHasNext(res.hasNext)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [seq, sort, page, isInitial])

  const onChangeSort = (next: ReviewSortOrder) => {
    if (next === sort) return
    setSort(next)
    setPage(1)
  }

  if (totalCount === 0) {
    return (
      <div className="border-stroke-soft bg-bg-weak rounded-2xl border px-6 py-12 text-center">
        <p className="text-text-strong text-base font-semibold">아직 이 주차장에 흔적이 없어요</p>
        <p className="text-text-sub mt-2 text-sm">
          직접 다녀오시면 첫 흔적의 주인공이 될 수 있어요.
          <br />
          주차권 사용 후 영수증 화면에서 흔적을 남겨주세요.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="border-stroke-soft mb-1 flex items-center justify-between border-b pb-3">
        <p className="text-text-strong text-sm font-semibold">
          흔적 <span className="tabular-nums">{totalCount}</span>건
        </p>
        <div className="flex items-center gap-1 text-sm">
          <button
            type="button"
            onClick={() => onChangeSort('recent')}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              sort === 'recent' ? 'bg-brand-900 text-white' : 'text-text-sub hover:bg-bg-soft'
            }`}
          >
            최신순
          </button>
          <button
            type="button"
            onClick={() => onChangeSort('rating')}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              sort === 'rating' ? 'bg-brand-900 text-white' : 'text-text-sub hover:bg-bg-soft'
            }`}
          >
            별점순
          </button>
        </div>
      </div>

      <ul className={loading ? 'opacity-60 transition-opacity' : ''}>
        {reviews.map((r) => (
          <li key={r.id}>
            <ReviewCard review={r} onReport={setReportTarget} />
          </li>
        ))}
      </ul>

      {hasNext && (
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={loading}
          className="border-stroke-sub hover:border-text-strong hover:bg-bg-soft text-text-strong mt-4 w-full rounded-full border bg-white py-3 text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? '불러오는 중...' : '더 보기'}
        </button>
      )}

      {reportTarget && (
        <ReportDialog key={reportTarget.id} target={reportTarget} onClose={() => setReportTarget(null)} />
      )}
    </>
  )
}
