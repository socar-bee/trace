'use client'

import { useEffect, useState } from 'react'

import { getMyReviews } from '@/shared/lib/trace-storage'

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

  return {
    mounted,
    reviews,
    count: reviews.length,
    isEmpty: mounted && reviews.length === 0
  }
}
