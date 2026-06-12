'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

import { getTicketTotal } from '@/shared/lib/ticket-storage'

import { useAuthStore } from '@/shared/stores/authStore'

import type { EventLeaderboard } from '@/shared/types/event'

import { fetchEventLeaderboard } from '@/shared/mocks/api'

const subscribe = () => () => {}
const getSnap = () => true
const getServerSnap = () => false

export function useLeaderboardViewModel() {
  const hydrated = useSyncExternalStore(subscribe, getSnap, getServerSnap)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const [data, setData] = useState<EventLeaderboard | null>(null)

  useEffect(() => {
    if (!hydrated) return
    let cancelled = false
    fetchEventLeaderboard(getTicketTotal(), 50).then((r) => {
      if (!cancelled) setData(r)
    })
    return () => {
      cancelled = true
    }
  }, [hydrated])

  return { canRender: hydrated, isLoggedIn: hydrated && isLoggedIn, data }
}
