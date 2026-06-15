'use client'

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'

import {
  earnTickets,
  getQuestEarnCounts,
  getTicketTotal,
  hasEnteredDraw,
  isReviewCappedToday,
  submitDrawEntry
} from '@/shared/lib/ticket-storage'

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
  const [entered, setEntered] = useState(false)
  const [preview, setPreview] = useState<EventLeaderboard | null>(null)
  const [inviteCopied, setInviteCopied] = useState(false)

  const refresh = useCallback(() => {
    setMyTickets(getTicketTotal())
    setEarnCounts(getQuestEarnCounts())
    setReviewCapped(isReviewCappedToday())
    setEntered(hasEnteredDraw())
  }, [])

  // 마운트 시 첫 방문 응모권 자동 적립(계정에 쌓임) + 상태 동기화. 응모 확정은 별도 '응모하기' 버튼.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!hydrated) return
    if (isLoggedIn && status === 'active') earnTickets('enter')
    refresh()
  }, [hydrated, isLoggedIn, status, refresh])
  /* eslint-enable react-hooks/set-state-in-effect */

  // 리더보드 프리뷰 — 응모 확정한 경우에만 내 응모권을 랭킹에 반영
  useEffect(() => {
    if (!hydrated) return
    let cancelled = false
    fetchEventLeaderboard(entered ? myTickets : 0, 5).then((r) => {
      if (!cancelled) setPreview(r)
    })
    return () => {
      cancelled = true
    }
  }, [hydrated, entered, myTickets])

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

  // 응모하기 — 보유 응모권으로 드로우 참여 확정 (응모권을 추가 적립하지는 않음)
  const enterDraw = useCallback(() => {
    submitDrawEntry()
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
    hasEntered: entered,
    myTickets,
    quests,
    preview,
    inviteCopied,
    enterDraw,
    copyInviteLink,
    simulateInviteJoin
  }
}
