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
import { getRecommendStats } from './recommends'
import { getRecentReviewCount, getReviewsBySeq, getWeeklyNewReviewCount } from './reviews'
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

interface BuildItemOptions {
  withHotScore?: number // hours window
}

function buildPopularItem(lot: ParkingLot, opts: BuildItemOptions = {}): PopularParkingLot {
  const reviews = getReviewsBySeq(lot.seq)
  const stats = aggregateStats(reviews, lot.seq)
  const recommend = getRecommendStats(lot.seq)
  return {
    seq: lot.seq,
    name: lot.name,
    address: lot.address,
    areaKey: lot.areaKey,
    weeklyNewReviewCount: getWeeklyNewReviewCount(lot.seq),
    avgRating: stats.avgRating,
    totalReviewCount: stats.totalReviewCount,
    recommendUpCount: recommend.upCount,
    recommendDownCount: recommend.downCount,
    hotScore: opts.withHotScore ? getRecentReviewCount(lot.seq, opts.withHotScore) : undefined
  }
}

// ─── Widget feed types ───────────────────────────────────────

export interface RecentReview {
  reviewId: string
  parkingLotSeq: string
  parkingLotName: string
  rating: number
  content: string | null
  createdAt: string
  isNew: boolean
}

export interface LiveActivity {
  id: string
  nickname: string
  parkingLotSeq: string
  parkingLotName: string
  rating: number
  createdAt: string
}

/**
 * 최신 후기 — 모든 주차장의 review 합쳐서 최신순. "자유게시판" 위젯용.
 */
export async function fetchRecentReviews(limit = 6): Promise<RecentReview[]> {
  const all: RecentReview[] = []
  const dayAgo = Date.now() - 24 * 3600_000
  for (const lot of MOCK_PARKING_LOTS) {
    const reviews = getReviewsBySeq(lot.seq)
    for (const r of reviews) {
      all.push({
        reviewId: r.id,
        parkingLotSeq: r.parkingLotSeq,
        parkingLotName: lot.name,
        rating: r.rating,
        content: r.content,
        createdAt: r.createdAt,
        isNew: new Date(r.createdAt).getTime() >= dayAgo
      })
    }
  }
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit)
}

/**
 * 실시간 활동 stream — "X님이 Y에 후기 남김" 채팅 위젯용.
 */
export async function fetchLiveActivities(limit = 8): Promise<LiveActivity[]> {
  const all: LiveActivity[] = []
  for (const lot of MOCK_PARKING_LOTS) {
    const reviews = getReviewsBySeq(lot.seq)
    for (const r of reviews) {
      all.push({
        id: r.id,
        nickname: r.nickname,
        parkingLotSeq: lot.seq,
        parkingLotName: lot.name,
        rating: r.rating,
        createdAt: r.createdAt
      })
    }
  }
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit)
}

export async function fetchPopularParkingLots(limit = 6): Promise<PopularParkingLot[]> {
  return MOCK_PARKING_LOTS.map((lot) => buildPopularItem(lot))
    .sort((a, b) => b.weeklyNewReviewCount - a.weeklyNewReviewCount)
    .slice(0, limit)
}

export interface TotalStats {
  totalReviews: number
  totalRecommends: number
  totalParkingLots: number
  totalActiveDrivers: number
}

/**
 * 전체 누적 통계 — 메인 Hero의 live stats counter 용.
 */
export async function fetchTotalStats(): Promise<TotalStats> {
  let totalReviews = 0
  let totalRecommends = 0
  const driverSet = new Set<string>()
  for (const lot of MOCK_PARKING_LOTS) {
    const reviews = getReviewsBySeq(lot.seq)
    totalReviews += reviews.length
    for (const r of reviews) driverSet.add(r.nickname)
    totalRecommends += getRecommendStats(lot.seq).upCount
  }
  return {
    totalReviews,
    totalRecommends,
    totalParkingLots: MOCK_PARKING_LOTS.length,
    totalActiveDrivers: driverSet.size
  }
}

/**
 * 실시간 Hot — 최근 N시간(default 6h) 내 새 후기가 많이 쌓인 주차장.
 */
export async function fetchHotParkingLots(limit = 4, hours = 6): Promise<PopularParkingLot[]> {
  return MOCK_PARKING_LOTS.map((lot) => buildPopularItem(lot, { withHotScore: hours }))
    .filter((p) => (p.hotScore ?? 0) > 0)
    .sort((a, b) => (b.hotScore ?? 0) - (a.hotScore ?? 0))
    .slice(0, limit)
}

/**
 * 오늘의 주차장 — 오늘 날짜를 시드로 결정론적 1개.
 * 자정에 자동 변경.
 */
export async function fetchTodayPick(): Promise<PopularParkingLot | null> {
  const today = new Date()
  const dayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  let h = 2166136261
  for (let i = 0; i < dayKey.length; i++) {
    h = Math.imul(h ^ dayKey.charCodeAt(i), 16777619) >>> 0
  }
  const idx = h % MOCK_PARKING_LOTS.length
  const lot = MOCK_PARKING_LOTS[idx]
  if (!lot) return null
  return buildPopularItem(lot)
}

/**
 * 가장 추천받는 곳 — 추천 비율 + 절대 수 가중치.
 */
export async function fetchTopRecommendedParkingLots(limit = 6): Promise<PopularParkingLot[]> {
  return MOCK_PARKING_LOTS.map((lot) => buildPopularItem(lot))
    .map((p) => {
      const total = (p.recommendUpCount ?? 0) + (p.recommendDownCount ?? 0)
      const ratio = total === 0 ? 0 : (p.recommendUpCount ?? 0) / total
      // 추천 비율 0.7 이상 + 절대 수 영향
      const score = ratio * 100 + Math.log10((p.recommendUpCount ?? 0) + 1) * 20
      return { ...p, _score: score }
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
    .map(({ _score: _, ...rest }) => rest)
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
  recommend: { upCount: number; downCount: number }
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
    hasNext: sliced.length < sorted.length,
    recommend: getRecommendStats(seq)
  }
}

export async function searchParkingLotsApi(keyword: string): Promise<ParkingLot[]> {
  return searchParkingLots(keyword)
}

/**
 * 주차장 검색 — PopularParkingLot 메타까지 포함한 카드용 결과.
 */
export async function searchParkingLotsWithStats(keyword: string): Promise<PopularParkingLot[]> {
  const lots = searchParkingLots(keyword)
  return lots.map((lot) => buildPopularItem(lot))
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
