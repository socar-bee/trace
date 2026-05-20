'use client'

import Link from 'next/link'

import { getMyReviews } from '@/shared/lib/trace-storage'

interface WriteErrorProps {
  reason: 'expired' | 'already_written' | 'invalid'
}

const COPY = {
  expired: {
    title: '이 링크는 만료되었어요',
    desc: '후기 작성 토큰은 발급 후 24시간 동안만 유효해요.\n모두의주차장 앱에서 다시 시도해주세요.',
    cta: { label: 'Trace 홈으로', href: '/' }
  },
  already_written: {
    title: '이미 후기를 남기셨어요',
    desc: '하나의 결제 건당 한 번만 후기를 남길 수 있어요.\n작성하신 후기를 확인해보세요.',
    cta: { label: '내 후기 보러가기', href: '/me/traces' }
  },
  invalid: {
    title: '잘못된 진입 경로예요',
    desc: '토큰이 유효하지 않아요.\n모두의주차장 영수증 화면의 「Trace 남기기」 버튼을 눌러주세요.',
    cta: { label: 'Trace 홈으로', href: '/' }
  }
} as const

export default function WriteError({ reason }: WriteErrorProps) {
  const copy = COPY[reason]
  const lastReview = reason === 'already_written' ? getMyReviews()[0] : null
  const goHref = reason === 'already_written' && lastReview ? `/p/${lastReview.parkingLotSeq}` : copy.cta.href
  const goLabel = reason === 'already_written' && lastReview ? '작성한 후기 보러가기' : copy.cta.label

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center md:px-6">
      <h1 className="text-text-strong text-2xl font-bold md:text-3xl">{copy.title}</h1>
      <p className="text-text-sub mt-3 text-sm whitespace-pre-line md:text-base">{copy.desc}</p>
      <Link
        href={goHref}
        className="bg-brand-500 hover:bg-brand-700 active:bg-brand-900 text-static-white mt-8 inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold transition-colors"
      >
        {goLabel}
      </Link>
    </main>
  )
}
