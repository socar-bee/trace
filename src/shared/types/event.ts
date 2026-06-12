export type EventQuestId = 'enter' | 'signup' | 'review' | 'verify' | 'invite'

export type EventStatus = 'upcoming' | 'active' | 'ended'

/**
 * 퀘스트 적립 한도.
 * - once: 평생 1회 (enter, signup)
 * - daily: 하루 limit건 (review)
 * - total: 누적 limit건 (invite)
 * - unlimited: 횟수 제한 없음 — refId 중복만 막음 (verify: 인증 건당 1회)
 */
export type QuestCap =
  | { kind: 'once' }
  | { kind: 'daily'; limit: number }
  | { kind: 'total'; limit: number }
  | { kind: 'unlimited' }

export interface EventQuestDef {
  id: EventQuestId
  title: string
  description: string
  /** 1회 적립 응모권 수 */
  tickets: number
  cap: QuestCap
  cta?: { label: string; href: string }
}

export interface EntryTicket {
  id: string
  questId: EventQuestId
  amount: number
  earnedAt: string // ISO
  /** 동일 행위 중복 적립 방지 키 (예: review id, 인증 건 식별자) */
  refId?: string
}

export type EarnFailureReason = 'duplicate' | 'capped' | 'event-closed'

export type EarnResult = { ok: true; ticket: EntryTicket; total: number } | { ok: false; reason: EarnFailureReason }

export interface LeaderboardEntry {
  rank: number
  maskedNickname: string
  tickets: number
  isMe?: boolean
}

export interface EventLeaderboard {
  entries: LeaderboardEntry[]
  myRank: number | null
  myTickets: number
  totalParticipants: number
}
