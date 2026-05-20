import type {
  ParkingLot,
  ParkingLotDetail,
  ParkingLotTagSummary,
  PopularParkingLot,
  Review,
  ReviewSortOrder,
  TagKey,
  VerifyTokenResult
} from '@/shared/types/trace'

import { MOCK_PARKING_LOTS, findParkingLotBySeq, searchParkingLots } from './parkingLots'
import { getReviewsBySeq, getWeeklyNewReviewCount } from './reviews'
import { verifyMockToken } from './tokens'

const DEFAULT_PAGE_SIZE = 8

function pseudoRevisitRate(seq: string): number {
  let s = 2166136261
  for (let i = 0; i < seq.length; i++) {
    s = Math.imul(s ^ seq.charCodeAt(i), 16777619) >>> 0
  }
  return 0.18 + (s % 50) / 100
}

function aggregateStats(reviews: Review[], seq: string) {
  if (reviews.length === 0) {
    return { avgRating: 0, totalReviewCount: 0, revisitRate: 0 }
  }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return {
    avgRating: Math.round((sum / reviews.length) * 10) / 10,
    totalReviewCount: reviews.length,
    revisitRate: pseudoRevisitRate(seq)
  }
}

function aggregateTopTags(reviews: Review[]): ParkingLotTagSummary[] {
  const counts = new Map<TagKey, number>()
  for (const r of reviews) {
    for (const t of r.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export async function fetchPopularParkingLots(limit = 6): Promise<PopularParkingLot[]> {
  const list = MOCK_PARKING_LOTS.map<PopularParkingLot>((lot) => {
    const reviews = getReviewsBySeq(lot.seq)
    const stats = aggregateStats(reviews, lot.seq)
    return {
      seq: lot.seq,
      name: lot.name,
      address: lot.address,
      areaKey: lot.areaKey,
      weeklyNewReviewCount: getWeeklyNewReviewCount(lot.seq),
      avgRating: stats.avgRating,
      totalReviewCount: stats.totalReviewCount
    }
  })
  return list.sort((a, b) => b.weeklyNewReviewCount - a.weeklyNewReviewCount).slice(0, limit)
}

export async function fetchParkingLotsByArea(areaKey: string): Promise<PopularParkingLot[]> {
  const lots = MOCK_PARKING_LOTS.filter((p) => p.areaKey === areaKey)
  return lots.map<PopularParkingLot>((lot) => {
    const reviews = getReviewsBySeq(lot.seq)
    const stats = aggregateStats(reviews, lot.seq)
    return {
      seq: lot.seq,
      name: lot.name,
      address: lot.address,
      areaKey: lot.areaKey,
      weeklyNewReviewCount: getWeeklyNewReviewCount(lot.seq),
      avgRating: stats.avgRating,
      totalReviewCount: stats.totalReviewCount
    }
  })
}

export interface ParkingLotDetailQuery {
  sort?: ReviewSortOrder
  page?: number
  pageSize?: number
}

export interface ParkingLotDetailResult extends ParkingLotDetail {
  page: number
  pageSize: number
  hasNext: boolean
}

export async function fetchParkingLotDetail(
  seq: string,
  query: ParkingLotDetailQuery = {}
): Promise<ParkingLotDetailResult | null> {
  const info = findParkingLotBySeq(seq)
  if (!info) return null

  const allReviews = getReviewsBySeq(seq)
  const sort = query.sort ?? 'recent'
  const sorted =
    sort === 'rating'
      ? [...allReviews].sort((a, b) => b.rating - a.rating || b.createdAt.localeCompare(a.createdAt))
      : [...allReviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const page = Math.max(1, query.page ?? 1)
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE
  const sliced = sorted.slice(0, page * pageSize)

  return {
    info,
    stats: aggregateStats(allReviews, seq),
    topTags: aggregateTopTags(allReviews),
    reviews: sliced,
    page,
    pageSize,
    hasNext: sliced.length < sorted.length
  }
}

export async function searchParkingLotsApi(keyword: string): Promise<ParkingLot[]> {
  return searchParkingLots(keyword)
}

export async function verifyToken(token: string, hasWritten: boolean): Promise<VerifyTokenResult> {
  return verifyMockToken(token, hasWritten)
}

export interface SubmitReviewPayload {
  rating: number
  tags: TagKey[]
  content?: string
}

export interface SubmitReviewSuccess {
  ok: true
  review: Review
  redirectUrl: string
}

export interface SubmitReviewFailure {
  ok: false
  reason: 'invalid_token' | 'already_written' | 'expired'
}

export async function submitReview(
  token: string,
  hasWritten: boolean,
  payload: SubmitReviewPayload
): Promise<SubmitReviewSuccess | SubmitReviewFailure> {
  const verified = verifyMockToken(token, hasWritten)
  if (!verified.valid) {
    if (verified.reason === 'expired') return { ok: false, reason: 'expired' }
    if (verified.reason === 'already_written') return { ok: false, reason: 'already_written' }
    return { ok: false, reason: 'invalid_token' }
  }
  const review: Review = {
    id: `r-mine-${Date.now()}`,
    paymentSeq: verified.paymentSeq,
    parkingLotSeq: verified.parkingLotSeq,
    nickname: verified.nickname,
    rating: payload.rating,
    content: payload.content ?? null,
    tags: payload.tags,
    enterTime: verified.enterTime,
    exitTime: verified.exitTime,
    status: 1,
    createdAt: new Date().toISOString()
  }
  return {
    ok: true,
    review,
    redirectUrl: `/p/${verified.parkingLotSeq}`
  }
}
