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

export function findMyReviewById(id: string): Review | undefined {
  return getMyReviews().find((r) => r.id === id)
}

export function deleteMyReview(id: string): void {
  if (typeof window === 'undefined') return
  const next = getMyReviews().filter((r) => r.id !== id)
  localStorage.setItem(WRITTEN_REVIEWS_KEY, JSON.stringify(next))
}

export function updateMyReview(id: string, patch: Partial<Pick<Review, 'rating' | 'tags' | 'content'>>): Review | null {
  if (typeof window === 'undefined') return null
  const list = getMyReviews()
  const idx = list.findIndex((r) => r.id === id)
  if (idx < 0) return null
  const merged: Review = { ...list[idx], ...patch }
  const next = [...list]
  next[idx] = merged
  localStorage.setItem(WRITTEN_REVIEWS_KEY, JSON.stringify(next))
  return merged
}
