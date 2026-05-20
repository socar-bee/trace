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
  latitude: number
  longitude: number
  hourlyPrice: number
  areaKey?: string
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
  weeklyNewReviewCount: number
  avgRating: number
  totalReviewCount: number
}

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
