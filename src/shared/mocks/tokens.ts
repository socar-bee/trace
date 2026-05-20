import { generateNickname } from '@/shared/lib/nickname'

import type { VerifyTokenResult } from '@/shared/types/trace'

import { findParkingLotBySeq } from './parkingLots'

interface MockTokenRecord {
  paymentSeq: string
  parkingLotSeq: string
  carHash: string
  enterTime: string
  exitTime: string
  expired?: boolean
}

const NOW = Date.now()
const FOUR_HOURS_AGO = new Date(NOW - 4 * 3600_000).toISOString()
const TWO_HOURS_AGO = new Date(NOW - 2 * 3600_000).toISOString()

const MOCK_TOKENS: Record<string, MockTokenRecord> = {
  'demo-101': {
    paymentSeq: 'pay-demo-101',
    parkingLotSeq: '101',
    carHash: 'hash-demo-101',
    enterTime: FOUR_HOURS_AGO,
    exitTime: TWO_HOURS_AGO
  },
  'demo-201': {
    paymentSeq: 'pay-demo-201',
    parkingLotSeq: '201',
    carHash: 'hash-demo-201',
    enterTime: FOUR_HOURS_AGO,
    exitTime: TWO_HOURS_AGO
  },
  'demo-401': {
    paymentSeq: 'pay-demo-401',
    parkingLotSeq: '401',
    carHash: 'hash-demo-401',
    enterTime: FOUR_HOURS_AGO,
    exitTime: TWO_HOURS_AGO
  },
  'demo-expired': {
    paymentSeq: 'pay-demo-expired',
    parkingLotSeq: '101',
    carHash: 'hash-demo-expired',
    enterTime: new Date(NOW - 48 * 3600_000).toISOString(),
    exitTime: new Date(NOW - 46 * 3600_000).toISOString(),
    expired: true
  }
}

export function verifyMockToken(token: string, hasWritten: boolean): VerifyTokenResult {
  const record = MOCK_TOKENS[token]
  if (!record) return { valid: false, reason: 'invalid' }
  if (record.expired) return { valid: false, reason: 'expired' }
  if (hasWritten) return { valid: false, reason: 'already_written' }

  const lot = findParkingLotBySeq(record.parkingLotSeq)
  if (!lot) return { valid: false, reason: 'invalid' }

  return {
    valid: true,
    paymentSeq: record.paymentSeq,
    parkingLotSeq: record.parkingLotSeq,
    parkingLotName: lot.name,
    nickname: generateNickname(record.carHash),
    enterTime: record.enterTime,
    exitTime: record.exitTime
  }
}

export const DEMO_TOKEN_HINTS = [
  { token: 'demo-101', label: '강남역 센터필드' },
  { token: 'demo-201', label: '홍대입구 와이즈파크' },
  { token: 'demo-401', label: '잠실 롯데월드몰' },
  { token: 'demo-expired', label: '만료 토큰 예시' }
]
