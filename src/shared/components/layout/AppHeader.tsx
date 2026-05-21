'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'

import { IcoSearch } from '@/shared/components/icons'
import SearchAutocomplete from '@/shared/components/ui/SearchAutocomplete'

import { useAuthStore } from '@/shared/stores/authStore'

const subscribe = () => () => {}
const getSnap = () => true
const getServerSnap = () => false

interface AppHeaderProps {
  showSearch?: boolean
  initialKeyword?: string
}

export default function AppHeader({ showSearch = true, initialKeyword = '' }: AppHeaderProps) {
  const hydrated = useSyncExternalStore(subscribe, getSnap, getServerSnap)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const profile = useAuthStore((s) => s.profile)
  const logout = useAuthStore((s) => s.logout)

  return (
    <header className="bg-bg border-line sticky top-0 z-[var(--z-header)] border-b">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-fg flex shrink-0 items-baseline gap-1.5 text-[20px] font-extrabold tracking-[-0.02em]"
        >
          Trace
          <span
            className="bg-accent inline-block size-2.5 self-center"
            style={{ boxShadow: '2px 2px 0 var(--color-fg)' }}
            aria-hidden
          />
        </Link>

        {/* Search (desktop) */}
        {showSearch && (
          <div className="hidden flex-1 md:block">
            <SearchAutocomplete variant="header" initialKeyword={initialKeyword} placeholder="주차장·지역 검색" />
          </div>
        )}

        {/* Nav */}
        <nav className="ml-auto flex shrink-0 items-center gap-3 text-sm">
          {showSearch && (
            <Link
              href="/search"
              aria-label="검색"
              className="hover:bg-bg-2 inline-flex size-9 items-center justify-center md:hidden"
            >
              <IcoSearch className="text-fg" />
            </Link>
          )}

          {hydrated && isLoggedIn ? (
            <>
              <Link
                href="/me/traces"
                className="border-line-2 hover:border-fg bg-bg text-fg inline-flex items-center gap-1.5 border-[1.5px] px-3 py-1.5 font-mono text-xs transition-colors"
              >
                <span className="bg-accent-500 inline-block size-1.5 rounded-full" aria-hidden />
                <span className="hidden sm:inline">{profile?.userName ?? '내 후기'}</span>
                {profile?.isVerifiedUser && (
                  <span className="bg-accent-500 text-static-white px-1 py-px text-[9px] font-bold tracking-wider">
                    검증
                  </span>
                )}
              </Link>
              <button type="button" onClick={logout} className="text-fg-3 hover:text-fg text-xs transition-colors">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-fg-2 hover:text-fg text-sm font-medium transition-colors">
                로그인
              </Link>
              <Link
                href="/signup"
                className="bg-accent text-static-white border-fg inline-flex items-center border-[1.5px] px-3.5 py-1.5 text-xs font-bold transition-transform hover:-translate-y-px"
                style={{ boxShadow: '2px 2px 0 var(--color-fg)' }}
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
