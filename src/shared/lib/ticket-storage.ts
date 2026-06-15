'use client'

import type { EarnResult, EntryTicket, EventQuestId } from '@/shared/types/event'

import { EVENT_QUEST_MAP, getEventStatus } from '@/shared/mocks/event'

const ENTRY_TICKETS_KEY = 'trace_entry_tickets'

export function getEntryTickets(): EntryTicket[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(ENTRY_TICKETS_KEY) ?? '[]') as EntryTicket[]
  } catch {
    return []
  }
}

export function getTicketTotal(): number {
  return getEntryTickets().reduce((acc, t) => acc + t.amount, 0)
}

/** questId별 적립 "건수" (응모권 장수 아님 — 캡 판정용) */
export function getQuestEarnCounts(): Record<EventQuestId, number> {
  const counts: Record<EventQuestId, number> = { enter: 0, signup: 0, review: 0, verify: 0, invite: 0 }
  for (const t of getEntryTickets()) counts[t.questId] += 1
  return counts
}

function isSameLocalDay(iso: string, now: Date): boolean {
  const d = new Date(iso)
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

/**
 * 퀘스트 달성 → 응모권 적립. 캡/중복 판정 포함.
 * 실패해도 호출부 흐름을 막지 않도록 항상 EarnResult 반환 (throw 없음).
 */
export function earnTickets(questId: EventQuestId, refId?: string): EarnResult {
  if (typeof window === 'undefined') return { ok: false, reason: 'event-closed' }
  if (getEventStatus() !== 'active') return { ok: false, reason: 'event-closed' }

  const quest = EVENT_QUEST_MAP[questId]
  const existing = getEntryTickets()
  if (refId && existing.some((t) => t.questId === questId && t.refId === refId)) {
    return { ok: false, reason: 'duplicate' }
  }

  const sameQuest = existing.filter((t) => t.questId === questId)
  const now = new Date()
  if (quest.cap.kind === 'once' && sameQuest.length > 0) return { ok: false, reason: 'duplicate' }
  if (
    quest.cap.kind === 'daily' &&
    sameQuest.filter((t) => isSameLocalDay(t.earnedAt, now)).length >= quest.cap.limit
  ) {
    return { ok: false, reason: 'capped' }
  }
  if (quest.cap.kind === 'total' && sameQuest.length >= quest.cap.limit) return { ok: false, reason: 'capped' }

  const ticket: EntryTicket = {
    id: `tk-${questId}-${now.getTime()}`,
    questId,
    amount: quest.tickets,
    earnedAt: now.toISOString(),
    refId
  }
  localStorage.setItem(ENTRY_TICKETS_KEY, JSON.stringify([ticket, ...existing]))
  return { ok: true, ticket, total: getTicketTotal() }
}

/** 오늘 review 퀘스트가 일일 캡에 도달했는지 — 퀘스트 카드 "오늘 한도 도달" 표기용 */
export function isReviewCappedToday(now = new Date()): boolean {
  const cap = EVENT_QUEST_MAP.review.cap
  if (cap.kind !== 'daily') return false
  return getEntryTickets().filter((t) => t.questId === 'review' && isSameLocalDay(t.earnedAt, now)).length >= cap.limit
}

// ─── 응모(draw entry) — 응모권 적립과 분리. 유저가 '응모하기'를 눌러야 참여 확정. ───
const DRAW_ENTERED_KEY = 'trace_event_entered'

export function hasEnteredDraw(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(DRAW_ENTERED_KEY) === '1'
}

/** 응모 확정 — 보유 응모권으로 이 드로우에 참여. 응모권을 추가로 적립하지는 않는다. */
export function submitDrawEntry(): boolean {
  if (typeof window === 'undefined') return false
  if (getEventStatus() !== 'active') return false
  localStorage.setItem(DRAW_ENTERED_KEY, '1')
  return true
}
