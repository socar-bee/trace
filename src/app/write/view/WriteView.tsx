'use client'

import Link from 'next/link'
import { useState } from 'react'

import { TAGS } from '@/shared/lib/tags'

import { useWriteViewModel } from '../viewmodel'

import WriteError from './WriteError'

interface WriteViewProps {
  token: string | null
  editId: string | null
  demoTokens: { token: string; label: string }[]
}

const RATING_LABELS = ['', '별로', '아쉬움', '평타', '좋음', '최고']

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function fmtDate(iso: string) {
  try {
    const d = new Date(iso)
    return `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`
  } catch {
    return iso
  }
}
function fmtTime(iso: string) {
  try {
    const d = new Date(iso)
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
  } catch {
    return iso
  }
}
function durationMin(enterIso: string, exitIso: string) {
  try {
    return Math.round((new Date(exitIso).getTime() - new Date(enterIso).getTime()) / 60_000)
  } catch {
    return 0
  }
}

export default function WriteView({ token, editId, demoTokens }: WriteViewProps) {
  const vm = useWriteViewModel({ token, editId })
  const [hover, setHover] = useState(0)

  if (vm.status.kind === 'loading') {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 items-center justify-center px-6">
        <p className="text-fg-3 font-mono text-xs tracking-wider uppercase">LOADING · 토큰 확인중</p>
      </main>
    )
  }

  if (vm.status.kind === 'no-token') {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 md:px-6">
        <h1 className="text-fg text-2xl font-bold md:text-3xl">후기 남기기</h1>
        <p className="text-fg-2 mt-3 text-sm md:text-base">
          후기는 모두의주차장 앱에서 주차권을 사용한 운전자만 남길 수 있어요. 영수증 화면의 「Trace 남기기」 버튼을 눌러
          진입해주세요.
        </p>
        <section className="bg-bg-2 mt-8 rounded-xl p-5">
          <h2 className="text-fg font-mono text-[11px] font-semibold tracking-wider uppercase">데모 진입 토큰</h2>
          <p className="text-fg-3 mt-1 font-mono text-[10px]">MVP 단계에서 작성 흐름을 체험할 수 있어요.</p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {demoTokens.map((d) => (
              <li key={d.token}>
                <Link
                  href={`/write?token=${d.token}`}
                  className="hover:bg-bg flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
                >
                  <span className="text-fg font-medium">{d.label}</span>
                  <code className="text-fg-3 font-mono text-xs">{d.token}</code>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    )
  }

  if (vm.status.kind === 'error') {
    return <WriteError reason={vm.status.reason} />
  }

  const { verified } = vm.status
  const dur = durationMin(verified.enterTime, verified.exitTime)
  const durLabel = `${Math.floor(dur / 60)}H ${pad2(dur % 60)}M`
  const exitDate = fmtDate(verified.exitTime)
  const enterT = fmtTime(verified.enterTime)
  const exitT = fmtTime(verified.exitTime)
  const carHashShort = `${verified.paymentSeq.slice(0, 4).toLowerCase()}…${verified.paymentSeq.slice(-4).toLowerCase()}`
  const barcodeText =
    verified.exitTime.slice(0, 10).replace(/-/g, '') + '.' + verified.exitTime.slice(11, 16).replace(':', '')
  const ratingDisplay = hover || vm.rating

  return (
    <main className="flex-1">
      <div className="write-receipt-wrap">
        <article className="write-receipt">
          {/* Brand head */}
          <header className="write-receipt__head">
            <div className="write-receipt__brand">
              TRACE
              <span className="write-receipt__brand-dot" />
            </div>
            <div className="write-receipt__sub">{vm.isEdit ? 'PARKING REVIEW · EDIT' : 'PARKING REVIEW'}</div>
          </header>

          <hr className="receipt__hr" />

          {/* Visit detail rows — 영수증 본문 */}
          <div className="receipt__row">
            <span className="receipt__row-label">닉네임</span>
            <span className="receipt__row-value">{verified.nickname}</span>
          </div>
          <div className="receipt__row">
            <span className="receipt__row-label">차량</span>
            <span className="receipt__row-value">{carHashShort}</span>
          </div>
          <div className="receipt__row">
            <span className="receipt__row-label">날짜</span>
            <span className="receipt__row-value">{exitDate}</span>
          </div>
          <div className="receipt__row">
            <span className="receipt__row-label">시간</span>
            <span className="receipt__row-value">
              {enterT} → {exitT}
            </span>
          </div>
          <div className="receipt__row">
            <span className="receipt__row-label">주차장</span>
            <span className="receipt__row-value" style={{ color: 'var(--color-accent)' }}>
              {verified.parkingLotName}
            </span>
          </div>
          <div className="receipt__row">
            <span className="receipt__row-label">결제</span>
            <span className="receipt__row-value">#{verified.paymentSeq}</span>
          </div>

          <hr className="receipt__hr" />

          {/* Rating field */}
          <div className="write-receipt__field">
            <div className="write-receipt__field-head">
              <span>
                별점
                <span className="write-receipt__field-req">필수</span>
              </span>
              <span className="write-receipt__field-hint">전체 만족도</span>
            </div>
            <div className="write-receipt__stars" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <svg
                  key={n}
                  className="write-receipt__star"
                  data-on={ratingDisplay >= n}
                  viewBox="0 0 24 24"
                  fill={ratingDisplay >= n ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  onMouseEnter={() => setHover(n)}
                  onClick={() => vm.setRating(n)}
                >
                  <path
                    d="M12 2.5l2.95 6.5 7.05.8-5.3 4.8 1.55 7.1L12 18l-6.25 3.7L7.3 14.6 2 9.8l7.05-.8z"
                    strokeLinejoin="round"
                  />
                </svg>
              ))}
            </div>
            <div className="write-receipt__rating-label">
              {vm.rating ? `${vm.rating}.0 / 5 · ${RATING_LABELS[vm.rating]}` : '별점을 선택하세요'}
            </div>
          </div>

          {/* Tags field */}
          <div className="write-receipt__field">
            <div className="write-receipt__field-head">
              <span>
                태그
                <span className="write-receipt__field-req">필수</span>
              </span>
              <span className="write-receipt__field-hint">복수 선택</span>
            </div>
            <div className="write-receipt__tags">
              {TAGS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className="write-receipt__tag"
                  data-sentiment={t.sentiment}
                  data-active={vm.tags.includes(t.key)}
                  onClick={() => vm.toggleTag(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Signature / comment */}
          <div className="write-receipt__field">
            <div className="write-receipt__field-head">
              <span>한줄 후기</span>
              <span className="write-receipt__field-hint">최대 {vm.contentMaxLength}자 · 선택사항</span>
            </div>
            <div className="write-receipt__signature">
              <textarea
                className="write-receipt__signature-area"
                value={vm.content}
                onChange={(e) => vm.updateContent(e.target.value)}
                placeholder="이곳에 서명하듯 후기를 남겨주세요. 직접 겪은 점만 적어주세요."
              />
              <div className="write-receipt__signature-foot" data-warn={vm.remainingChars < 50}>
                <span className="write-receipt__signature-hint">익명 영수증 후기</span>
                <span>
                  {vm.content.length} / {vm.contentMaxLength}
                </span>
              </div>
            </div>
          </div>

          <hr className="receipt__hr" />

          {/* Summary row — 검증 + 이용시간 */}
          <div className="receipt__row receipt__row--bold">
            <span className="receipt__row-label">검증</span>
            <span className="receipt__row-value" style={{ color: 'var(--color-accent-700)' }}>
              ✓ 영수증 검증완료
            </span>
          </div>
          <div className="receipt__row">
            <span className="receipt__row-label">이용시간</span>
            <span className="receipt__row-value">{durLabel}</span>
          </div>

          <hr className="receipt__hr" />

          {vm.submitError && (
            <div className="bg-negative-50 text-negative-700 mb-3 rounded px-3 py-2 text-xs">{vm.submitError}</div>
          )}

          {/* CTA */}
          <div className="write-receipt__cta">
            <button
              type="button"
              className="write-receipt__submit"
              onClick={() => void vm.submit()}
              disabled={vm.rating < 1 || vm.submitting}
            >
              {vm.submitting
                ? 'SAVING…'
                : vm.rating > 0
                  ? vm.isEdit
                    ? '후기 수정 저장 →'
                    : '후기 게시하기 →'
                  : '★ 별점을 선택하세요'}
            </button>
            <button type="button" className="write-receipt__cancel" onClick={vm.cancel}>
              ← 취소하고 돌아가기
            </button>
          </div>

          {/* Barcode */}
          <div className="receipt__barcode">
            <div className="receipt__barcode-bars" aria-hidden />
            <div className="receipt__barcode-code">{barcodeText}</div>
          </div>

          <div className="receipt__thanks">thank you for your trace.</div>
          <div className="receipt__footnote">trace.modu.kr · retain this copy</div>

          <div className="write-receipt__notice">
            게시 후 24시간 내 수정·삭제 가능 · 동일 주차장 24시간 1회 제한 · 차량번호는 SHA256 해시되어 역추적 불가
          </div>
        </article>
      </div>
    </main>
  )
}
