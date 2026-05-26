'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { REVIEW_CONTENT_MAX_LENGTH } from '@/shared/lib/constants'
import { findMyReviewById, hasWrittenForPayment, saveMyReview, updateMyReview } from '@/shared/lib/trace-storage'

import type { TagKey, VerifyTokenResult } from '@/shared/types/trace'

import { submitReview, verifyToken } from '@/shared/mocks/api'
import { findParkingLotBySeq } from '@/shared/mocks/parkingLots'

export type WriteStatus =
  | { kind: 'loading' }
  | { kind: 'no-token' }
  | { kind: 'error'; reason: 'expired' | 'already_written' | 'invalid' }
  | { kind: 'ready'; verified: Extract<VerifyTokenResult, { valid: true }>; editId?: string }

interface UseWriteViewModelArgs {
  token: string | null
  editId?: string | null
}

export function useWriteViewModel({ token, editId = null }: UseWriteViewModelArgs) {
  const router = useRouter()
  const isEdit = !!editId
  const [status, setStatus] = useState<WriteStatus>(() =>
    isEdit || token ? { kind: 'loading' } : { kind: 'no-token' }
  )
  const [rating, setRating] = useState(0)
  const [tags, setTags] = useState<TagKey[]>([])
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Edit 모드: 마운트 후 localStorage 의 내 후기를 불러와 form 을 prefill.
  // 토큰 verify 를 건너뛰고, 주차장 정보는 mocks 에서 lookup 한다.
  // (SSR 첫 렌더는 localStorage 미접근 → hydration mismatch 회피.)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!isEdit || !editId) return
    const review = findMyReviewById(editId)
    if (!review) {
      setStatus({ kind: 'error', reason: 'invalid' })
      return
    }
    const lot = findParkingLotBySeq(review.parkingLotSeq)
    setRating(review.rating)
    setTags(review.tags)
    setContent(review.content ?? '')
    setStatus({
      kind: 'ready',
      editId,
      verified: {
        valid: true,
        paymentSeq: review.paymentSeq,
        parkingLotSeq: review.parkingLotSeq,
        parkingLotName: lot?.name ?? `주차장 #${review.parkingLotSeq}`,
        nickname: review.nickname,
        enterTime: review.enterTime,
        exitTime: review.exitTime
      }
    })
  }, [isEdit, editId])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (isEdit || !token) return
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
  }, [isEdit, token])

  const toggleTag = useCallback((k: TagKey) => {
    setTags((prev) => (prev.includes(k) ? prev.filter((t) => t !== k) : [...prev, k]))
  }, [])

  const updateContent = useCallback((value: string) => {
    setContent(value.slice(0, REVIEW_CONTENT_MAX_LENGTH))
  }, [])

  const submit = useCallback(async () => {
    if (status.kind !== 'ready') return
    if (rating < 1) {
      setSubmitError('별점을 선택해주세요')
      return
    }
    setSubmitError(null)
    setSubmitting(true)

    // Edit mode: localStorage 만 갱신, 서버 호출 없음.
    if (status.editId) {
      const updated = updateMyReview(status.editId, {
        rating,
        tags,
        content: content.trim() || null
      })
      if (!updated) {
        setSubmitting(false)
        setSubmitError('수정 대상을 찾지 못했어요.')
        return
      }
      router.push(`/p/${status.verified.parkingLotSeq}`)
      return
    }

    if (!token) return
    const hasWritten = hasWrittenForPayment(status.verified.paymentSeq)
    const result = await submitReview(token, hasWritten, {
      rating,
      tags,
      content: content.trim() || undefined
    })

    if (!result.ok) {
      setSubmitting(false)
      if (result.reason === 'already_written') setStatus({ kind: 'error', reason: 'already_written' })
      else if (result.reason === 'expired') setStatus({ kind: 'error', reason: 'expired' })
      else setSubmitError('후기 등록에 실패했어요. 다시 시도해주세요.')
      return
    }
    saveMyReview(result.review)
    router.push(result.redirectUrl)
  }, [status, token, rating, tags, content, router])

  const cancel = useCallback(() => router.back(), [router])

  return {
    status,
    isEdit,
    rating,
    setRating,
    tags,
    toggleTag,
    content,
    updateContent,
    remainingChars: REVIEW_CONTENT_MAX_LENGTH - content.length,
    contentMaxLength: REVIEW_CONTENT_MAX_LENGTH,
    submitting,
    submitError,
    submit,
    cancel
  }
}
