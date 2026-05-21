'use client'

import { useEffect, useState } from 'react'

import { getRecommendVote, setRecommendVote } from '@/shared/lib/recommend-storage'

import type { RecommendVote } from '@/shared/types/trace'

interface RecommendPollProps {
  parkingLotSeq: string
  baseUpCount: number
  baseDownCount: number
}

/**
 * 주차장 추천/비추천 — 영수증 톤 + row 자체가 progress bar.
 * dashed 위/아래 절취선 + 각 vote row에 % 비율 background fill (별도 bar 제거).
 */
export default function RecommendPoll({ parkingLotSeq, baseUpCount, baseDownCount }: RecommendPollProps) {
  const [vote, setVote] = useState<RecommendVote>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVote(getRecommendVote(parkingLotSeq))
    setMounted(true)
  }, [parkingLotSeq])

  const toggle = (next: 'up' | 'down') => {
    const newVote: RecommendVote = vote === next ? null : next
    setVote(newVote)
    setRecommendVote(parkingLotSeq, newVote)
  }

  const up = baseUpCount + (mounted && vote === 'up' ? 1 : 0)
  const down = baseDownCount + (mounted && vote === 'down' ? 1 : 0)
  const total = up + down
  const upPct = total === 0 ? 0 : Math.round((up / total) * 100)
  const downPct = total === 0 ? 0 : 100 - upPct

  return (
    <section className="mb-7">
      {/* Header */}
      <header className="mb-3 flex items-baseline justify-between">
        <h2 className="text-fg font-mono text-[11px] font-bold tracking-[0.1em] uppercase">이 주차장 어때요?</h2>
        <p className="text-fg-3 font-mono text-[10px] tabular-nums">{total.toLocaleString('ko-KR')}명 참여</p>
      </header>

      {/* Receipt body — dashed 위/아래 절취선 */}
      <div className="border-fg flex flex-col gap-2 border-y border-dashed py-5">
        <VoteRow
          type="up"
          label="추천"
          count={up}
          pct={upPct}
          voted={mounted && vote === 'up'}
          onClick={() => toggle('up')}
        />
        <VoteRow
          type="down"
          label="비추천"
          count={down}
          pct={downPct}
          voted={mounted && vote === 'down'}
          onClick={() => toggle('down')}
        />
      </div>
    </section>
  )
}

function VoteRow({
  type,
  label,
  count,
  pct,
  voted,
  onClick
}: {
  type: 'up' | 'down'
  label: string
  count: number
  pct: number
  voted: boolean
  onClick: () => void
}) {
  const isUp = type === 'up'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={voted}
      className={`group relative w-full overflow-hidden border transition-colors ${
        voted ? (isUp ? 'border-pos' : 'border-neg') : 'border-line-2 hover:border-fg-3'
      }`}
    >
      {/* % 비율 background fill — row 자체가 progress bar */}
      <div
        className={`absolute inset-y-0 left-0 transition-[width] duration-300 ${isUp ? 'bg-pos-soft' : 'bg-neg-soft'}`}
        style={{ width: `${pct}%` }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative flex items-baseline gap-3 px-4 py-3">
        <span className={`shrink-0 font-mono text-xs tracking-wider uppercase ${isUp ? 'text-pos' : 'text-neg'}`}>
          {isUp ? '👍' : '👎'} {label}
        </span>
        <span className="flex-1" />
        <span className="text-fg-3 font-mono text-[11px] tabular-nums">{pct}%</span>
        <span
          className={`w-12 text-right text-xl leading-none font-extrabold tracking-[-0.02em] tabular-nums ${
            isUp ? 'text-pos' : 'text-neg'
          }`}
        >
          {count.toLocaleString('ko-KR')}
        </span>
      </div>
    </button>
  )
}
