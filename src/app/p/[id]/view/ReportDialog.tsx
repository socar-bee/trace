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
    <div className="report-receipt-overlay" role="dialog" aria-modal="true" aria-labelledby="report-receipt-title">
      <button type="button" aria-label="배경 클릭으로 닫기" className="report-receipt-scrim" onClick={onClose} />
      <article className="report-receipt">
        <header className="report-receipt__head">
          <div className="report-receipt__brand">
            REPORT
            <span className="report-receipt__brand-dot" aria-hidden />
          </div>
          <div className="report-receipt__sub">REVIEW · INTEGRITY FORM</div>
          <button type="button" onClick={onClose} aria-label="닫기" className="report-receipt__close">
            <IcoClose />
          </button>
        </header>

        <hr className="receipt__hr" />

        <div className="receipt__row">
          <span className="receipt__row-label">대상</span>
          <span className="receipt__row-value">{target.nickname}</span>
        </div>
        <div className="receipt__row">
          <span className="receipt__row-label">별점</span>
          <span className="receipt__row-value">{target.rating}.0 / 5</span>
        </div>
        <div className="receipt__row">
          <span className="receipt__row-label">유형</span>
          <span className="receipt__row-value">익명 후기 · 변조 불가</span>
        </div>

        <hr className="receipt__hr" />

        {submitted ? (
          <div className="report-receipt__done">
            <div className="report-receipt__done-mark" aria-hidden>
              ✓
            </div>
            <p className="report-receipt__done-title">신고 접수 완료</p>
            <p className="report-receipt__done-sub">검토 후 정책 위반 시 24시간 내 비공개 처리됩니다.</p>
          </div>
        ) : (
          <>
            <div id="report-receipt-title" className="report-receipt__field-head">
              <span>신고 사유</span>
              <span className="report-receipt__field-hint">단일 선택 · 필수</span>
            </div>
            <ul className="report-receipt__reasons">
              {REASONS.map((r) => (
                <li key={r.key}>
                  <button
                    type="button"
                    className="report-receipt__reason"
                    data-active={reason === r.key}
                    onClick={() => setReason(r.key)}
                  >
                    <span className="report-receipt__reason-mark" aria-hidden />
                    <span className="report-receipt__reason-label">{r.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <hr className="receipt__hr" />

            <button type="button" onClick={onSubmit} disabled={!reason} className="report-receipt__submit">
              {reason ? '신고 접수하기 →' : '사유를 선택하세요'}
            </button>
            <button type="button" onClick={onClose} className="report-receipt__cancel">
              ← 취소하고 돌아가기
            </button>

            <div className="report-receipt__notice">
              허위 신고는 계정 제재 사유가 될 수 있습니다 · 신고 내역은 익명으로 운영팀에만 전달됩니다
            </div>
          </>
        )}
      </article>
    </div>
  )
}
