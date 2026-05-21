'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'

import { useAuthStore } from '@/shared/stores/authStore'

interface WriteCTAProps {
  seq: string
}

const subscribeHydration = () => () => {}
const getHydrated = () => true
const getServerHydrated = () => false

/**
 * 상세 페이지 하단 작성 CTA.
 * 사용자 상태별 분기:
 * - 검증된 회원 → `/write?token=demo-{seq}` 즉시
 * - 로그인만 한 회원 → `/verify` (영수증 검증)
 * - 비회원 → `/login?return=/verify`
 *
 * SSR-safe: hydration 전에는 비회원 경로 default (가장 안전한 fallback).
 */
export default function WriteCTA({ seq }: WriteCTAProps) {
  const hydrated = useSyncExternalStore(subscribeHydration, getHydrated, getServerHydrated)
  const profile = useAuthStore((s) => s.profile)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  const href = !hydrated
    ? '/login?return=/verify'
    : profile?.isVerifiedUser
      ? `/write?token=demo-${seq}`
      : isLoggedIn
        ? '/verify'
        : '/login?return=/verify'

  return (
    <aside className="border-fg bg-brand-50 mt-7 mb-3 flex flex-col items-start justify-between gap-3 border p-5 md:flex-row md:items-center md:gap-4 md:p-6">
      <div>
        <p className="text-fg text-base font-extrabold tracking-tight md:text-lg">여기 다녀오셨나요?</p>
        <p className="text-fg-2 mt-1 text-xs md:text-sm">영수증·이용내역만 첨부하면 AI가 자동으로 확인해드려요.</p>
      </div>
      <Link
        href={href}
        className="bg-accent text-static-white shrink-0 self-stretch px-5 py-3.5 text-center text-sm font-bold tracking-tight transition-transform hover:-translate-y-px md:self-auto"
        style={{ boxShadow: '3px 3px 0 var(--color-fg)' }}
      >
        후기 작성하기 →
      </Link>
    </aside>
  )
}
