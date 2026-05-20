'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { IcoCheck } from '@/shared/components/icons'
import { StarRatingInput } from '@/shared/components/ui/StarRating'
import TagPill from '@/shared/components/ui/Tag'

import { REVIEW_CONTENT_MAX_LENGTH } from '@/shared/lib/constants'
import { formatVisitWindow } from '@/shared/lib/format'
import { TAGS } from '@/shared/lib/tags'
import { hasWrittenForPayment, saveMyReview } from '@/shared/lib/trace-storage'

import type { TagKey, VerifyTokenResult } from '@/shared/types/trace'

import { submitReview, verifyToken } from '@/shared/mocks/api'

import WriteError from './WriteError'

interface WriteViewProps {
  token: string | null
  demoTokens: { token: string; label: string }[]
}

type Status =
  | { kind: 'loading' }
  | { kind: 'no-token' }
  | { kind: 'error'; reason: 'expired' | 'already_written' | 'invalid' }
  | { kind: 'ready'; verified: Extract<VerifyTokenResult, { valid: true }> }

export default function WriteView({ token, demoTokens }: WriteViewProps) {
  const router = useRouter()
  const [status, setStatus] = useState<Status>(() => (token ? { kind: 'loading' } : { kind: 'no-token' }))

  const [rating, setRating] = useState(0)
  const [tags, setTags] = useState<TagKey[]>([])
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    ;(async () => {
      const result = await verifyToken(token, false)
      if (cancelled) return
      if (!result.valid) {
        setStatus({ kind: 'error', reason: result.reason })
        return
      }
      if (hasWrittenForPayment(result.paymentSeq)) {
        setStatus({ kind: 'error', reason: 'already_written' })
        return
      }
      setStatus({ kind: 'ready', verified: result })
    })()
    return () => {
      cancelled = true
    }
  }, [token])

  const toggleTag = (k: TagKey) => {
    setTags((prev) => (prev.includes(k) ? prev.filter((t) => t !== k) : [...prev, k]))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status.kind !== 'ready' || !token) return
    if (rating < 1) {
      setSubmitError('별점을 선택해주세요')
      return
    }
    setSubmitError(null)
    setSubmitting(true)

    const hasWritten = hasWrittenForPayment(status.verified.paymentSeq)
    const result = await submitReview(token, hasWritten, {
      rating,
      tags,
      content: content.trim() || undefined
    })

    if (!result.ok) {
      setSubmitting(false)
      if (result.reason === 'already_written') {
        setStatus({ kind: 'error', reason: 'already_written' })
      } else if (result.reason === 'expired') {
        setStatus({ kind: 'error', reason: 'expired' })
      } else {
        setSubmitError('흔적 등록에 실패했어요. 다시 시도해주세요.')
      }
      return
    }

    saveMyReview(result.review)
    router.push(result.redirectUrl)
  }

  if (status.kind === 'loading') {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 items-center justify-center px-4 md:px-6">
        <p className="text-text-soft text-sm">토큰을 확인하는 중...</p>
      </main>
    )
  }

  if (status.kind === 'no-token') {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 md:px-6">
        <h1 className="text-text-strong text-2xl font-bold md:text-3xl">흔적 남기기</h1>
        <p className="text-text-sub mt-3 text-sm md:text-base">
          흔적은 모두의주차장 앱에서 주차권을 사용한 운전자만 남길 수 있어요. 영수증 화면의 「Trace 남기기」 버튼을 눌러
          진입해주세요.
        </p>

        <section className="bg-bg-soft mt-8 rounded-xl p-5">
          <h2 className="text-text-strong text-sm font-semibold">데모용 진입 토큰</h2>
          <p className="text-text-soft mt-1 text-xs">MVP 단계에서는 아래 토큰으로 흔적 작성을 체험할 수 있어요.</p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {demoTokens.map((d) => (
              <li key={d.token}>
                <Link
                  href={`/write?token=${d.token}`}
                  className="hover:bg-bg-white flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
                >
                  <span className="text-text-strong font-medium">{d.label}</span>
                  <code className="text-text-soft font-mono text-xs">{d.token}</code>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    )
  }

  if (status.kind === 'error') {
    return <WriteError reason={status.reason} />
  }

  const { verified } = status
  const remaining = REVIEW_CONTENT_MAX_LENGTH - content.length

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 md:px-6 md:py-10">
      {/* 인증 배너 */}
      <div className="bg-accent-50 ring-accent-100 mb-6 flex items-center gap-2.5 rounded-xl px-4 py-3 ring-1 md:mb-8">
        <span className="bg-accent-600 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-white">
          <IcoCheck />
        </span>
        <p className="text-accent-700 text-sm md:text-[15px]">
          주차권 사용 확인됨 · <span className="font-bold">{verified.nickname}</span> 인증됨
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-[minmax(0,320px)_1fr] md:gap-10">
        {/* 컨텍스트 */}
        <aside className="border-stroke-soft md:sticky md:top-24 md:self-start md:rounded-2xl md:border md:bg-white md:p-6">
          <p className="text-text-soft text-xs font-medium md:text-sm">방문한 주차장</p>
          <h2 className="text-text-strong mt-1 text-lg leading-tight font-bold md:text-xl">
            {verified.parkingLotName}
          </h2>
          <p className="text-text-sub mt-3 text-sm">{formatVisitWindow(verified.enterTime, verified.exitTime)}</p>
        </aside>

        {/* 폼 */}
        <div className="flex flex-col gap-6 md:gap-8">
          {/* 별점 */}
          <section className="border-stroke-soft rounded-2xl border bg-white p-5 md:p-6">
            <h3 className="text-text-strong text-base font-semibold">
              이 주차장 어땠어요? <span className="text-negative-500">*</span>
            </h3>
            <div className="mt-4 flex justify-center md:justify-start">
              <StarRatingInput value={rating} onChange={setRating} />
            </div>
          </section>

          {/* 빠른 태그 */}
          <section className="border-stroke-soft rounded-2xl border bg-white p-5 md:p-6">
            <h3 className="text-text-strong text-base font-semibold">한 마디로 표현하면</h3>
            <p className="text-text-soft mt-1 text-xs">여러 개 선택할 수 있어요</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {TAGS.map((t) => {
                const active = tags.includes(t.key)
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => toggleTag(t.key)}
                    className="transition-transform active:scale-95"
                    aria-pressed={active}
                  >
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition-colors ${
                        active
                          ? t.sentiment === 'positive'
                            ? 'bg-accent-600 ring-accent-700 text-white'
                            : 'bg-negative-600 ring-negative-700 text-white'
                          : 'bg-bg-white ring-stroke-sub text-text-sub hover:ring-text-strong'
                      }`}
                    >
                      {t.label}
                    </span>
                  </button>
                )
              })}
            </div>
            {tags.length > 0 && (
              <div className="text-text-soft mt-3 flex flex-wrap items-center gap-1 text-xs">
                <span>선택됨:</span>
                {tags.map((k) => (
                  <TagPill key={k} tag={k} />
                ))}
              </div>
            )}
          </section>

          {/* 자유 코멘트 */}
          <section className="border-stroke-soft rounded-2xl border bg-white p-5 md:p-6">
            <h3 className="text-text-strong text-base font-semibold">자유롭게 남기고 싶은 말</h3>
            <p className="text-text-soft mt-1 text-xs">선택 사항 · 최대 {REVIEW_CONTENT_MAX_LENGTH}자</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, REVIEW_CONTENT_MAX_LENGTH))}
              placeholder="가본 사람만 아는 정보, 다음 운전자에게 도움이 될 한 마디"
              rows={5}
              className="border-stroke-soft focus:border-text-strong focus:ring-text-strong/20 placeholder:text-text-soft mt-3 w-full resize-none rounded-lg border bg-white px-3.5 py-3 text-sm leading-relaxed transition-shadow outline-none focus:ring-2"
            />
            <p
              className={`mt-1.5 text-right text-xs tabular-nums ${remaining < 50 ? 'text-negative-600' : 'text-text-soft'}`}
            >
              {content.length} / {REVIEW_CONTENT_MAX_LENGTH}
            </p>
          </section>

          {submitError && (
            <div className="bg-negative-50 text-negative-700 ring-negative-100 rounded-lg px-4 py-3 text-sm ring-1">
              {submitError}
            </div>
          )}

          {/* 액션 */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="border-stroke-sub hover:bg-bg-soft text-text-sub flex-1 rounded-full border bg-white py-3.5 text-sm font-semibold transition-colors"
              disabled={submitting}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting || rating < 1}
              className="bg-brand-900 disabled:bg-bg-sub disabled:text-text-disabled flex-[2] rounded-full py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
            >
              {submitting ? '등록 중...' : '흔적 남기기'}
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}
