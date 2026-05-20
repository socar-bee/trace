'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { IcoLogout, IcoSearch, IcoUser } from '@/shared/components/icons'
import Logo from '@/shared/components/ui/Logo'
import SearchAutocomplete from '@/shared/components/ui/SearchAutocomplete'

import { useAuthStore } from '@/shared/stores/authStore'

interface AppHeaderProps {
  showSearch?: boolean
  initialKeyword?: string
}

export default function AppHeader({ showSearch = true, initialKeyword = '' }: AppHeaderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const profile = useAuthStore((s) => s.profile)
  const logout = useAuthStore((s) => s.logout)

  return (
    <header className="border-stroke-soft bg-bg-white/85 sticky top-0 z-[var(--z-header)] border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-3 px-4 md:h-16 md:px-6">
        <Logo size="md" showSubtitle />

        {showSearch && (
          <div className="hidden flex-1 md:flex md:justify-center">
            <div className="w-full max-w-md">
              <SearchAutocomplete variant="header" initialKeyword={initialKeyword} placeholder="주차장·지역명 검색" />
            </div>
          </div>
        )}

        <div className="ml-auto flex items-center gap-1">
          {showSearch && (
            <Link
              href="/search"
              aria-label="검색"
              className="hover:bg-bg-soft inline-flex size-9 items-center justify-center rounded-full md:hidden"
            >
              <IcoSearch className="text-icon-strong" />
            </Link>
          )}

          {mounted && isLoggedIn ? (
            <>
              <Link
                href="/me/traces"
                className="text-text-strong hover:bg-bg-soft hover:text-brand-700 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors"
              >
                <IcoUser className="size-[18px]" />
                <span className="hidden sm:inline">{profile?.userName ?? '내 후기'}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                aria-label="로그아웃"
                className="text-text-soft hover:bg-bg-soft hover:text-text-strong hidden size-9 items-center justify-center rounded-full transition-colors sm:inline-flex"
              >
                <IcoLogout />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-brand-500 hover:bg-brand-700 active:bg-brand-900 text-static-white inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
