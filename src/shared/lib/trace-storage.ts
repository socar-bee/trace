'use client'

import type { Review } from '@/shared/types/trace'

const WRITTEN_REVIEWS_KEY = 'trace_my_reviews'

export function getMyReviews(): Review[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(WRITTEN_REVIEWS_KEY) ?? '[]') as Review[]
  } catch {
    return []
  }
}

export function saveMyReview(review: Review): void {
  if (typeof window === 'undefined') return
  const prev = getMyReviews().filter((r) => r.paymentSeq !== review.paymentSeq)
  localStorage.setItem(WRITTEN_REVIEWS_KEY, JSON.stringify([review, ...prev]))
}

export function hasWrittenForPayment(paymentSeq: string): boolean {
  return getMyReviews().some((r) => r.paymentSeq === paymentSeq)
}
