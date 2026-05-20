export type TagKey = 'guide-good' | 'cheap' | 'narrow' | 'slow-gate' | 'often-full'
export type TagSentiment = 'positive' | 'negative' | 'neutral'

export interface TagDef {
  key: TagKey
  label: string
  sentiment: TagSentiment
}

export interface Review {
  id: string
  paymentSeq: string
  parkingLotSeq: string
  nickname: string
  rating: number
  content: string | null
  tags: TagKey[]
  enterTime: string
  exitTime: string
  status: 1 | 2 | 3
  createdAt: string
}

export interface ParkingLot {
  seq: string
  name: string
  address: string
  addrRoad?: string // 위·경도 표기 (mono로 표시)
  latitude: number
  longitude: number
  hourlyPrice: number
  areaKey?: string
  /** 한글 지역명 (editorial UI 표기) */
  areaLabel?: string
  pricePer?: number // 분당 금액 (예: 600)
  priceUnit?: string // 단위 라벨 (예: "10분")
  open?: string // 운영시간 (예: "24시간", "06–24시")
  totalSpots?: number // 주차면 수
  gateType?: string // 게이트 형태 (예: "LPR · 무인")
  badges?: string[] // 부가 라벨 (LPR, 공영, 발레가능 등)
  hot?: boolean // 라이브 dot 표시
}

export interface ParkingLotStats {
  avgRating: number
  totalReviewCount: number
  revisitRate: number
}

export interface ParkingLotTagSummary {
  tag: TagKey
  count: number
}

export interface ParkingLotDetail {
  info: ParkingLot
  stats: ParkingLotStats
  topTags: ParkingLotTagSummary[]
  reviews: Review[]
}

export interface PopularParkingLot {
  seq: string
  name: string
  address: string
  areaKey?: string
  /** 한글 지역명 (editorial 카드) */
  areaLabel?: string
  /** 운영시간/주차면 등 editorial 카드 보조 정보 */
  pricePer?: number
  priceUnit?: string
  open?: string
  totalSpots?: number
  gateType?: string
  badges?: string[]
  hot?: boolean
  /** 재방문율 0~100 (editorial stat row) */
  revisitRatePct?: number
  weeklyNewReviewCount: number
  avgRating: number
  totalReviewCount: number
  recommendUpCount?: number
  recommendDownCount?: number
  hotScore?: number
}

export interface RecommendStats {
  upCount: number
  downCount: number
}

export type RecommendVote = 'up' | 'down' | null

export type VerifyTokenFailureReason = 'expired' | 'already_written' | 'invalid'

export type VerifyTokenResult =
  | {
      valid: true
      paymentSeq: string
      parkingLotSeq: string
      parkingLotName: string
      nickname: string
      enterTime: string
      exitTime: string
    }
  | {
      valid: false
      reason: VerifyTokenFailureReason
    }

export type ReviewSortOrder = 'recent' | 'rating'
