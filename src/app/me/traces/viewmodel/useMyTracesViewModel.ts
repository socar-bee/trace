'use client'

import { useCallback, useEffect, useState } from 'react'

import { deleteMyReview, getMyReviews } from '@/shared/lib/trace-storage'

import type { Review } from '@/shared/types/trace'

export function useMyTracesViewModel() {
  const [mounted, setMounted] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    // localStorage는 client-only이므로 mount 후 동기화한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReviews(getMyReviews())
    setMounted(true)
  }, [])

  const remove = useCallback((id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('이 후기를 삭제할까요? 되돌릴 수 없습니다.')) return
    deleteMyReview(id)
    setReviews(getMyReviews())
  }, [])

  return {
    mounted,
    reviews,
    count: reviews.length,
    isEmpty: mounted && reviews.length === 0,
    remove
  }
}
