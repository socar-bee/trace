'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { deleteMyReview, getMyReviews } from '@/shared/lib/trace-storage'

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
  // localStorage 는 SSR/첫 렌더 시 비어 있고, 마운트 후 읽어 hydration mismatch 회피.
  const [localReviews, setLocalReviews] = useState<Review[]>([])

  useEffect(() => {
    // 마운트 후 localStorage 동기화 — SSR/첫 렌더는 빈 배열 유지로 hydration mismatch 회피.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalReviews(getMyReviews().filter((r) => r.parkingLotSeq === seq))
  }, [seq])

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

  const deleteMine = useCallback((r: Review) => {
    if (typeof window !== 'undefined' && !window.confirm('이 후기를 삭제할까요? 되돌릴 수 없습니다.')) return
    deleteMyReview(r.id)
    setLocalReviews((prev) => prev.filter((x) => x.id !== r.id))
  }, [])

  // local + server merge. local 후기는 항상 맨 위에 고정해 사용자가 자기 글을 즉시 확인하도록.
  // id 충돌은 local 우선 (서버 동기화 이전 단계의 임시 글이 prevail).
  const mergedReviews = useMemo(() => {
    if (localReviews.length === 0) return reviews
    const localIds = new Set(localReviews.map((r) => r.id))
    const filteredServer = reviews.filter((r) => !localIds.has(r.id))
    return [...localReviews, ...filteredServer]
  }, [localReviews, reviews])

  return {
    sort,
    reviews: mergedReviews,
    localCount: localReviews.length,
    hasNext,
    loading,
    reportTarget,
    changeSort,
    loadMore,
    openReport,
    closeReport,
    deleteMine
  }
}
