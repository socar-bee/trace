import { MOCK_PARKING_LOTS } from '@/shared/mocks/parkingLots'

export interface ExtractedReceipt {
  parkingLotSeq: string
  parkingLotName: string
  enterAt: string // 'HH:MM'
  exitAt: string // 'HH:MM'
  duration: string // '2시간 22분'
  date: string // 'YYYY.MM.DD'
  amount: string // '8,400원'
}

export interface VerifySource {
  id: 'modu' | 'kakaot' | 'tmap' | 'upload'
  name: string
  desc: string
  icon: string
  bg: string
  fg?: string
}

export const VERIFY_SOURCES: VerifySource[] = [
  { id: 'modu', name: '모두의주차장', desc: '내 이용내역과 자동 매칭', icon: 'M', bg: '#0099ff' },
  { id: 'kakaot', name: '카카오T 주차', desc: '결제 영수증·이용내역', icon: 'K', bg: '#FEE500', fg: '#191919' },
  { id: 'tmap', name: '티맵 주차', desc: '결제 영수증·이용내역', icon: 'T', bg: '#EE0F38' },
  { id: 'upload', name: '주차 영수증 직접 업로드', desc: '사진·PDF — AI가 자동 인식', icon: '↑', bg: '#171717' }
]

/**
 * Mock 영수증 AI 추출 — 실제론 서버에서 OCR 처리.
 * 랜덤 lot 1개를 결정론적으로 골라서 결과 반환.
 */
export async function extractReceipt(): Promise<ExtractedReceipt> {
  await new Promise((r) => setTimeout(r, 2200))
  const sample = MOCK_PARKING_LOTS[Math.floor(Math.random() * MOCK_PARKING_LOTS.length)]
  if (!sample) throw new Error('샘플 주차장 없음')
  return {
    parkingLotSeq: sample.seq,
    parkingLotName: sample.name,
    enterAt: '14:23',
    exitAt: '16:45',
    duration: '2시간 22분',
    date: new Date()
      .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .replace(/\. /g, '.')
      .replace('.', '.'),
    amount: '8,400원'
  }
}
