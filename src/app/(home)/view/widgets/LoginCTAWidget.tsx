'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { IcoChevronRight, IcoLogout, IcoUser } from '@/shared/components/icons'

import { useAuthStore } from '@/shared/stores/authStore'

const BENEFITS = ['🔄 디바이스 동기화', '👍 추천 영구 보존', '🔔 활동 알림']

export default function LoginCTAWidget() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const profile = useAuthStore((s) => s.profile)
  const logout = useAuthStore((s) => s.logout)

  // SSR/CSR hand-off — 마운트 전엔 logged-out 가정
  const showLoggedIn = mounted && isLoggedIn

  if (showLoggedIn) {
    return (
      <section className="border-stroke-soft rounded-2xl border bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="bg-brand-500 inline-flex size-10 shrink-0 items-center justify-center rounded-full text-white">
            <IcoUser className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-text-strong truncate text-sm font-bold">{profile?.userName ?? '운전자'}</p>
            <p className="text-text-soft truncate text-[11px]">{profile?.email ?? '로그인 완료'}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href="/me/traces"
            className="bg-bg-soft hover:bg-bg-sub text-text-strong inline-flex items-center justify-center gap-1 rounded-lg py-2 text-xs font-bold transition-colors"
          >
            내 후기
          </Link>
          <button
            type="button"
            onClick={logout}
            className="border-stroke-sub hover:bg-bg-soft text-text-sub inline-flex items-center justify-center gap-1 rounded-lg border py-2 text-xs font-bold transition-colors"
          >
            <IcoLogout className="size-3.5" />
            로그아웃
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="border-stroke-soft from-brand-500 to-brand-900 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 text-white">
      <div aria-hidden className="absolute -top-12 -right-12 size-40 rounded-full bg-white/15 blur-2xl" />
      <div className="relative">
        <p className="text-[10px] font-bold tracking-wider text-white/70 uppercase">로그인하면</p>
        <h2 className="mt-1 text-lg leading-tight font-black tracking-tight">후기를 영구 보관해요</h2>
        <ul className="mt-4 flex flex-col gap-1">
          {BENEFITS.map((b) => (
            <li key={b} className="text-[12px] font-medium text-white/90">
              {b}
            </li>
          ))}
        </ul>
        <Link
          href="/login"
          className="text-brand-700 mt-5 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-bold shadow-sm transition-transform hover:translate-x-0.5"
        >
          시작하기
          <IcoChevronRight className="size-3" />
        </Link>
      </div>
    </section>
  )
}
