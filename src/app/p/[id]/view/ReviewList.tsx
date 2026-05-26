'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

import { useReviewListViewModel } from '../viewmodel'
import type { Review } from '@/shared/types/trace'

import ReportDialog from './ReportDialog'
import ReviewCard from './ReviewCard'

interface ReviewListProps {
  seq: string
  initialReviews: Review[]
  initialHasNext: boolean
  totalCount: number
}

export default function ReviewList({ seq, initialReviews, initialHasNext, totalCount }: ReviewListProps) {
  const router = useRouter()
  const vm = useReviewListViewModel({ seq, initialReviews, initialHasNext })
  // 서버 totalCount + 로컬에 보관된 내 후기 (마운트 후 hydrate). 처음에는 localCount=0.
  const effectiveTotal = totalCount + vm.localCount

  const editMine = useCallback(
    (r: Review) => {
      router.push(`/write?edit=${encodeURIComponent(r.id)}`)
    },
    [router]
  )

  if (effectiveTotal === 0) {
    return (
      <div className="border-stroke-soft bg-bg-weak rounded-2xl border px-6 py-12 text-center">
        <p className="text-text-strong text-base font-semibold">아직 이 주차장에 후기가 없어요</p>
        <p className="text-text-sub mt-2 text-sm">
          직접 다녀오시면 첫 후기의 주인공이 될 수 있어요.
          <br />
          주차권 사용 후 영수증 화면에서 후기를 남겨주세요.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="border-stroke-soft mb-1 flex items-center justify-between border-b pb-3">
        <p className="text-text-strong text-sm font-semibold">
          후기 <span className="tabular-nums">{effectiveTotal}</span>건
          {vm.localCount > 0 && (
            <span className="text-accent ml-2 font-mono text-[11px] tracking-[0.05em]">+ 내 후기 {vm.localCount}</span>
          )}
        </p>
        <div className="flex items-center gap-1 text-sm">
          <button
            type="button"
            onClick={() => vm.changeSort('recent')}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              vm.sort === 'recent' ? 'bg-brand-500 text-white' : 'text-text-sub hover:bg-bg-soft'
            }`}
          >
            최신순
          </button>
          <button
            type="button"
            onClick={() => vm.changeSort('rating')}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              vm.sort === 'rating' ? 'bg-brand-500 text-white' : 'text-text-sub hover:bg-bg-soft'
            }`}
          >
            별점순
          </button>
        </div>
      </div>

      <ul className={vm.loading ? 'opacity-60 transition-opacity' : ''}>
        {vm.reviews.map((r, i) => {
          const mine = i < vm.localCount
          return (
            <li key={r.id}>
              <ReviewCard
                review={r}
                onReport={vm.openReport}
                isMine={mine}
                onEdit={mine ? editMine : undefined}
                onDelete={mine ? vm.deleteMine : undefined}
              />
            </li>
          )
        })}
      </ul>

      {vm.hasNext && (
        <button
          type="button"
          onClick={vm.loadMore}
          disabled={vm.loading}
          className="border-stroke-sub hover:border-text-strong hover:bg-bg-soft text-text-strong mt-4 w-full rounded-full border bg-white py-3 text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {vm.loading ? '불러오는 중...' : '더 보기'}
        </button>
      )}

      {vm.reportTarget && <ReportDialog key={vm.reportTarget.id} target={vm.reportTarget} onClose={vm.closeReport} />}
    </>
  )
}
