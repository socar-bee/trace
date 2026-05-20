'use client'

import type { RecommendVote } from '@/shared/types/trace'

const STORAGE_KEY = 'trace_recommends'

type Store = Record<string, 'up' | 'down'>

function read(): Store {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Store
  } catch {
    return {}
  }
}

function write(store: Store) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function getRecommendVote(parkingLotSeq: string): RecommendVote {
  return read()[parkingLotSeq] ?? null
}

export function setRecommendVote(parkingLotSeq: string, vote: RecommendVote): void {
  const store = read()
  if (vote === null) delete store[parkingLotSeq]
  else store[parkingLotSeq] = vote
  write(store)
}

export function getAllRecommendVotes(): Store {
  return read()
}
