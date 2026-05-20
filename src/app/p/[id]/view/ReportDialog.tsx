'use client'

import { useState } from 'react'

import { IcoClose } from '@/shared/components/icons'

import type { Review } from '@/shared/types/trace'

interface ReportDialogProps {
  target: Review
  onClose: () => void
}

const REASONS = [
  { key: 'ad', label: '광고성 글' },
  { key: 'false', label: '허위 정보' },
  { key: 'inappropriate', label: '부적절한 표현' },
  { key: 'other', label: '기타' }
] as const

export default function ReportDialog({ target, onClose }: ReportDialogProps) {
  const [reason, setReason] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = () => {
    if (!reason) return
    setSubmitted(true)
    setTimeout(onClose, 1400)
  }

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-end justify-center bg-black/40 p-0 md:items-center md:p-4">
      <div className="w-full max-w-sm rounded-t-2xl bg-white p-5 md:rounded-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-text-strong text-lg font-bold">후기 신고</h3>
            <p className="text-text-soft mt-1 text-xs">{target.nickname}님의 후기를 신고합니다</p>
          </div>
          <button type="button" onClick={onClose} aria-label="닫기" className="text-icon-soft -m-2 p-2">
            <IcoClose />
          </button>
        </div>

        {submitted ? (
          <p className="text-text-strong py-8 text-center text-sm font-medium">신고가 접수되었어요</p>
        ) : (
          <>
            <ul className="mt-4 flex flex-col gap-1">
              {REASONS.map((r) => (
                <li key={r.key}>
                  <button
                    type="button"
                    onClick={() => setReason(r.key)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm transition-colors ${
                      reason === r.key ? 'bg-bg-soft text-text-strong font-semibold' : 'text-text-sub hover:bg-bg-weak'
                    }`}
                  >
                    <span
                      className={`size-4 rounded-full border-2 ${
                        reason === r.key ? 'border-brand-500 bg-brand-500' : 'border-stroke-sub'
                      }`}
                    />
                    {r.label}
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={onSubmit}
              disabled={!reason}
              className="bg-brand-500 hover:bg-brand-700 active:bg-brand-900 disabled:bg-bg-sub disabled:text-text-disabled mt-5 w-full rounded-full py-3.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed"
            >
              신고 접수
            </button>
          </>
        )}
      </div>
    </div>
  )
}
