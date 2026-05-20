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
  'demo-1024': {
    paymentSeq: 'P38ZK4XQ',
    parkingLotSeq: '1024',
    carHash: 'hash-demo-1024',
    enterTime: FOUR_HOURS_AGO,
    exitTime: TWO_HOURS_AGO
  },
  'demo-1071': {
    paymentSeq: 'P92LM1WT',
    parkingLotSeq: '1071',
    carHash: 'hash-demo-1071',
    enterTime: FOUR_HOURS_AGO,
    exitTime: TWO_HOURS_AGO
  },
  'demo-1037': {
    paymentSeq: 'P55RQ7JN',
    parkingLotSeq: '1037',
    carHash: 'hash-demo-1037',
    enterTime: FOUR_HOURS_AGO,
    exitTime: TWO_HOURS_AGO
  },
  'demo-expired': {
    paymentSeq: 'P00EXPIRED',
    parkingLotSeq: '1024',
    carHash: 'hash-demo-expired',
    enterTime: new Date(NOW - 48 * 3600_000).toISOString(),
    exitTime: new Date(NOW - 46 * 3600_000).toISOString(),
    expired: true
  },
  // 기존 토큰 후방 호환 (혹시 외부 링크에 있을 수 있음)
  demo: {
    paymentSeq: 'P38ZK4XQ',
    parkingLotSeq: '1024',
    carHash: 'hash-demo-default',
    enterTime: FOUR_HOURS_AGO,
    exitTime: TWO_HOURS_AGO
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
  { token: 'demo-1024', label: '강남 N타워 지하주차장' },
  { token: 'demo-1071', label: '잠실 롯데 P3' },
  { token: 'demo-1037', label: '홍대입구 공영주차장' },
  { token: 'demo-expired', label: '만료 토큰 예시' }
]
