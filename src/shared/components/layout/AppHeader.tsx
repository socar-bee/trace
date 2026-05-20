'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { IcoSearch, IcoUser } from '@/shared/components/icons'
import Logo from '@/shared/components/ui/Logo'

interface AppHeaderProps {
  showSearch?: boolean
  initialKeyword?: string
}

export default function AppHeader({ showSearch = true, initialKeyword = '' }: AppHeaderProps) {
  const router = useRouter()
  const [keyword, setKeyword] = useState(initialKeyword)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const k = keyword.trim()
    if (!k) return
    router.push(`/search?q=${encodeURIComponent(k)}`)
  }

  return (
    <header className="border-stroke-soft bg-bg-white/95 sticky top-0 z-[var(--z-header)] border-b backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-3 px-4 md:h-16 md:px-6">
        <Logo size="md" showSubtitle />

        {showSearch && (
          <form onSubmit={onSubmit} className="hidden flex-1 md:block">
            <label className="bg-bg-soft hover:bg-bg-sub focus-within:ring-brand-900 mx-auto flex h-10 max-w-md items-center gap-2 rounded-full px-4 transition-colors focus-within:ring-1">
              <IcoSearch className="text-icon-soft" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="주차장 이름·지역명 검색"
                className="placeholder:text-text-soft text-text-strong flex-1 bg-transparent text-sm outline-none"
              />
            </label>
          </form>
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
          <Link
            href="/me/traces"
            className="text-text-strong hover:bg-bg-soft inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium"
          >
            <IcoUser className="text-icon-strong" />
            <span className="hidden sm:inline">내 흔적</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
