import { generateNickname } from '@/shared/lib/nickname'

import type { EventQuestDef, EventQuestId, EventStatus } from '@/shared/types/event'

export const FSD_EVENT = {
  id: 'fsd-draw',
  badge: 'LUCKY DRAW',
  title: '궁금했던 FSD\n한 달 동안 내 차처럼',
  subtitle: '모델X(FSD) 1개월 사용권 · 단 2명',
  periodLabel: '응모 6.22 – 7.5 · 발표 7.20',
  period: { start: '2026-06-22T00:00:00+09:00', end: '2026-07-05T23:59:59+09:00' },
  announceAt: '2026-07-20T11:00:00+09:00',
  /** 데모 환경: 기간과 무관하게 상태 고정. null이면 period 기준 계산 */
  demoStatus: 'active' as EventStatus | null
}

export const EVENT_QUESTS: EventQuestDef[] = [
  {
    id: 'enter',
    title: '이벤트 첫 방문',
    description: '로그인하고 이벤트에 들어오면 응모권 1장 자동 지급',
    tickets: 1,
    cap: { kind: 'once' }
  },
  {
    id: 'signup',
    title: '회원가입',
    description: '신규 가입 시 1회 적립',
    tickets: 2,
    cap: { kind: 'once' },
    cta: { label: '가입하기', href: '/signup' }
  },
  {
    id: 'review',
    title: '후기 작성',
    description: '검증된 후기 1건당 적립 · 하루 3건까지',
    tickets: 3,
    cap: { kind: 'daily', limit: 3 },
    cta: { label: '후기 쓰기', href: '/write' }
  },
  {
    id: 'verify',
    title: '이용내역 인증',
    description: '주차 이용내역 인증 건당 적립',
    tickets: 2,
    cap: { kind: 'unlimited' },
    cta: { label: '인증하기', href: '/verify' }
  },
  {
    id: 'invite',
    title: '친구 초대',
    description: '친구가 가입을 완료하면 적립 · 최대 5명',
    tickets: 2,
    cap: { kind: 'total', limit: 5 }
  }
]

export const EVENT_QUEST_MAP: Record<EventQuestId, EventQuestDef> = Object.fromEntries(
  EVENT_QUESTS.map((q) => [q.id, q])
) as Record<EventQuestId, EventQuestDef>

export function getEventStatus(now = new Date()): EventStatus {
  if (FSD_EVENT.demoStatus) return FSD_EVENT.demoStatus
  if (now < new Date(FSD_EVENT.period.start)) return 'upcoming'
  if (now > new Date(FSD_EVENT.period.end)) return 'ended'
  return 'active'
}

export function maskNickname(name: string): string {
  return `${name.slice(0, 2)}**`
}

function pseudoRandom(seed: string): () => number {
  let s = 2166136261
  for (let i = 0; i < seed.length; i++) {
    s = Math.imul(s ^ seed.charCodeAt(i), 16777619) >>> 0
  }
  return () => {
    s = Math.imul(s ^ (s >>> 15), 2246822507) >>> 0
    s = Math.imul(s ^ (s >>> 13), 3266489909) >>> 0
    return ((s ^ (s >>> 16)) >>> 0) / 4294967296
  }
}

export interface MockRanker {
  maskedNickname: string
  tickets: number
}

const RANKER_COUNT = 42
/** 리더보드 풀 밖 일반 참여자 수 — "전체 N명 참여 중" 표기용 */
export const PARTICIPANT_BASE = 1284

/** 결정적 랭커 풀 — 거듭제곱 분포로 상위권을 얇게 만들어 자연스러운 랭킹 모양을 만든다. */
export function getMockRankers(): MockRanker[] {
  const rng = pseudoRandom('event:fsd-draw')
  const rankers: MockRanker[] = []
  for (let i = 0; i < RANKER_COUNT; i++) {
    const tickets = Math.max(1, Math.floor(Math.pow(rng(), 2.2) * 38) + 1)
    rankers.push({ maskedNickname: maskNickname(generateNickname(`event-ranker-${i}`)), tickets })
  }
  return rankers.sort((a, b) => b.tickets - a.tickets)
}
