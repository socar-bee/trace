'use client'

import { useCallback, useEffect, useState } from 'react'

import type { Review, ReviewSortOrder } from '@/shared/types/trace'

import { fetchParkingLotDetail } from '@/shared/mocks/api'

interface UseReviewListViewModelArgs {
  seq: string
  initialReviews: Review[]
  initialHasNext: boolean
  pageSize?: number
}

const DEFAULT_PAGE_SIZE = 8

export function useReviewListViewModel({
  seq,
  initialReviews,
  initialHasNext,
  pageSize = DEFAULT_PAGE_SIZE
}: UseReviewListViewModelArgs) {
  const [sort, setSort] = useState<ReviewSortOrder>('recent')
  const [page, setPage] = useState(1)
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [hasNext, setHasNext] = useState(initialHasNext)
  const [loading, setLoading] = useState(false)
  const [reportTarget, setReportTarget] = useState<Review | null>(null)

  // SSR 첫 페이지(recent + page 1)는 props 그대로 사용, sort/page 가 바뀌면 클라이언트에서 재요청.
  const isInitial = sort === 'recent' && page === 1

  useEffect(() => {
    if (isInitial) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    fetchParkingLotDetail(seq, { sort, page, pageSize }).then((res) => {
      if (cancelled || !res) return
      setReviews(res.reviews)
      setHasNext(res.hasNext)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [seq, sort, page, pageSize, isInitial])

  const changeSort = useCallback((next: ReviewSortOrder) => {
    setSort((prev) => {
      if (prev === next) return prev
      setPage(1)
      return next
    })
  }, [])

  const loadMore = useCallback(() => {
    setPage((p) => p + 1)
  }, [])

  const openReport = useCallback((r: Review) => setReportTarget(r), [])
  const closeReport = useCallback(() => setReportTarget(null), [])

  return {
    sort,
    reviews,
    hasNext,
    loading,
    reportTarget,
    changeSort,
    loadMore,
    openReport,
    closeReport
  }
}
