'use client'

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'

import { earnTickets, getQuestEarnCounts, getTicketTotal, isReviewCappedToday } from '@/shared/lib/ticket-storage'

import { useAuthStore } from '@/shared/stores/authStore'

import type { EventLeaderboard, EventQuestDef, EventQuestId } from '@/shared/types/event'

import { fetchEventLeaderboard } from '@/shared/mocks/api'
import { EVENT_QUESTS, FSD_EVENT, getEventStatus } from '@/shared/mocks/event'

const subscribe = () => () => {}
const getSnap = () => true
const getServerSnap = () => false

export interface QuestItemVM {
  def: EventQuestDef
  /** 적립 건수 (장수 아님) */
  earnCount: number
  /** once 퀘스트 완료 또는 total 캡 도달 */
  done: boolean
  /** daily 캡 도달 (오늘 한도) */
  cappedToday: boolean
}

export function useEventHubViewModel() {
  const hydrated = useSyncExternalStore(subscribe, getSnap, getServerSnap)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const status = getEventStatus()

  const [myTickets, setMyTickets] = useState(0)
  const [earnCounts, setEarnCounts] = useState<Record<EventQuestId, number>>({
    enter: 0,
    signup: 0,
    review: 0,
    verify: 0,
    invite: 0
  })
  const [reviewCapped, setReviewCapped] = useState(false)
  const [preview, setPreview] = useState<EventLeaderboard | null>(null)
  const [inviteCopied, setInviteCopied] = useState(false)

  const refresh = useCallback(() => {
    setMyTickets(getTicketTotal())
    setEarnCounts(getQuestEarnCounts())
    setReviewCapped(isReviewCappedToday())
  }, [])

  // 마운트 후 보유 응모권/퀘스트 상태 동기화 (적립은 명시적 '응모하기' 버튼으로)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!hydrated) return
    refresh()
  }, [hydrated, refresh])
  /* eslint-enable react-hooks/set-state-in-effect */

  // 리더보드 프리뷰 — 내 응모권 수가 바뀔 때마다 갱신
  useEffect(() => {
    if (!hydrated) return
    let cancelled = false
    fetchEventLeaderboard(myTickets, 5).then((r) => {
      if (!cancelled) setPreview(r)
    })
    return () => {
      cancelled = true
    }
  }, [hydrated, myTickets])

  const quests: QuestItemVM[] = useMemo(
    () =>
      EVENT_QUESTS.map((def) => {
        const earnCount = earnCounts[def.id]
        const done =
          (def.cap.kind === 'once' && earnCount > 0) || (def.cap.kind === 'total' && earnCount >= def.cap.limit)
        return { def, earnCount, done, cappedToday: def.id === 'review' && reviewCapped }
      }),
    [earnCounts, reviewCapped]
  )

  const copyInviteLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/signup?ref=trace-invite`)
      setInviteCopied(true)
      setTimeout(() => setInviteCopied(false), 1600)
    } catch {
      // clipboard 권한 거부 — 조용히 무시 (데모 환경)
    }
  }, [])

  // 응모하기 — 첫 응모권(enter)을 적립하며 참여 확정. (once 캡이라 재호출은 no-op)
  const enterDraw = useCallback(() => {
    earnTickets('enter')
    refresh()
  }, [refresh])

  // 데모: 초대받은 친구의 가입 완료를 시뮬레이션
  const simulateInviteJoin = useCallback(() => {
    earnTickets('invite', `invite-${Date.now()}`)
    refresh()
  }, [refresh])

  return {
    event: FSD_EVENT,
    status,
    canRender: hydrated,
    isLoggedIn: hydrated && isLoggedIn,
    hasEntered: earnCounts.enter > 0,
    myTickets,
    quests,
    preview,
    inviteCopied,
    enterDraw,
    copyInviteLink,
    simulateInviteJoin
  }
}
