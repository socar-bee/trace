'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { REVIEW_CONTENT_MAX_LENGTH } from '@/shared/lib/constants'
import { hasWrittenForPayment, saveMyReview } from '@/shared/lib/trace-storage'

import type { TagKey, VerifyTokenResult } from '@/shared/types/trace'

import { submitReview, verifyToken } from '@/shared/mocks/api'

export type WriteStatus =
  | { kind: 'loading' }
  | { kind: 'no-token' }
  | { kind: 'error'; reason: 'expired' | 'already_written' | 'invalid' }
  | { kind: 'ready'; verified: Extract<VerifyTokenResult, { valid: true }> }

interface UseWriteViewModelArgs {
  token: string | null
}

export function useWriteViewModel({ token }: UseWriteViewModelArgs) {
  const router = useRouter()
  const [status, setStatus] = useState<WriteStatus>(() => (token ? { kind: 'loading' } : { kind: 'no-token' }))
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

  const toggleTag = useCallback((k: TagKey) => {
    setTags((prev) => (prev.includes(k) ? prev.filter((t) => t !== k) : [...prev, k]))
  }, [])

  const updateContent = useCallback((value: string) => {
    setContent(value.slice(0, REVIEW_CONTENT_MAX_LENGTH))
  }, [])

  const submit = useCallback(async () => {
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
