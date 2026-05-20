'use client'

import { useEffect, useState } from 'react'

import { IcoThumbsDown, IcoThumbsUp } from '@/shared/components/icons'

import { getRecommendVote, setRecommendVote } from '@/shared/lib/recommend-storage'

import type { RecommendVote } from '@/shared/types/trace'

interface RecommendButtonsProps {
  parkingLotSeq: string
  baseUpCount: number
  baseDownCount: number
}

export default function RecommendButtons({ parkingLotSeq, baseUpCount, baseDownCount }: RecommendButtonsProps) {
  const [vote, setVote] = useState<RecommendVote>(null)
  const [mounted, setMounted] = useState(false)
  const [pulse, setPulse] = useState<'up' | 'down' | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVote(getRecommendVote(parkingLotSeq))
    setMounted(true)
  }, [parkingLotSeq])

  const toggle = (next: 'up' | 'down') => {
    const newVote: RecommendVote = vote === next ? null : next
    setVote(newVote)
    setRecommendVote(parkingLotSeq, newVote)
    if (newVote) {
      setPulse(newVote)
      setTimeout(() => setPulse(null), 400)
    }
  }

  const upCount = baseUpCount + (mounted && vote === 'up' ? 1 : 0)
  const downCount = baseDownCount + (mounted && vote === 'down' ? 1 : 0)
  const total = upCount + downCount
  const upPercent = total === 0 ? 0 : Math.round((upCount / total) * 100)
  const downPercent = total === 0 ? 0 : 100 - upPercent

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => toggle('up')}
          aria-pressed={vote === 'up'}
          aria-label="추천"
          className={`group/btn relative flex flex-col items-center gap-1.5 overflow-hidden rounded-2xl border-2 px-3 py-4 transition-all active:scale-95 ${
            vote === 'up'
              ? 'bg-accent-600 border-accent-700 text-white shadow-[0_6px_20px_rgba(34,197,94,0.4)]'
              : 'border-stroke-sub bg-bg-white text-text-sub hover:border-accent-500 hover:bg-accent-50 hover:text-accent-700'
          } ${pulse === 'up' ? 'animate-[pulse_0.4s_ease-out]' : ''}`}
        >
          <IcoThumbsUp filled={vote === 'up'} width={22} height={22} />
          <span className="text-lg font-black tabular-nums">{upCount.toLocaleString('ko-KR')}</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase opacity-70">추천</span>
        </button>

        <button
          type="button"
          onClick={() => toggle('down')}
          aria-pressed={vote === 'down'}
          aria-label="비추천"
          className={`group/btn relative flex flex-col items-center gap-1.5 overflow-hidden rounded-2xl border-2 px-3 py-4 transition-all active:scale-95 ${
            vote === 'down'
              ? 'border-red-700 bg-red-600 text-white shadow-[0_6px_20px_rgba(229,57,53,0.4)]'
              : 'border-stroke-sub bg-bg-white text-text-sub hover:border-red-500 hover:bg-red-50 hover:text-red-700'
          } ${pulse === 'down' ? 'animate-[pulse_0.4s_ease-out]' : ''}`}
        >
          <IcoThumbsDown filled={vote === 'down'} width={22} height={22} />
          <span className="text-lg font-black tabular-nums">{downCount.toLocaleString('ko-KR')}</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase opacity-70">비추천</span>
        </button>
      </div>

      {total > 0 && (
        <div>
          <div className="bg-bg-soft relative flex h-2 overflow-hidden rounded-full">
            <div className="bg-accent-500 transition-[width] duration-300" style={{ width: `${upPercent}%` }} />
            <div className="bg-red-500 transition-[width] duration-300" style={{ width: `${downPercent}%` }} />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] font-semibold tabular-nums">
            <span className="text-accent-700">👍 {upPercent}%</span>
            <span className="text-text-soft">{total.toLocaleString('ko-KR')}명 참여</span>
            <span className="text-red-600">👎 {downPercent}%</span>
          </div>
        </div>
      )}
    </div>
  )
}
