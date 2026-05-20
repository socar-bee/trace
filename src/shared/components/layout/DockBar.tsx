'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { IcoHome, IcoSearch, IcoUser, IcoWrite } from '@/shared/components/icons'

const NAV_ITEMS = [
  { label: '홈', href: '/', icon: IcoHome, match: (p: string) => p === '/' },
  { label: '검색', href: '/search', icon: IcoSearch, match: (p: string) => p.startsWith('/search') },
  { label: '후기', href: '/write', icon: IcoWrite, match: (p: string) => p.startsWith('/write') },
  { label: '내 후기', href: '/me/traces', icon: IcoUser, match: (p: string) => p.startsWith('/me') }
] as const

export default function DockBar() {
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)

  // Why: 시트/오버레이가 dock 영역을 피해 깔리도록 dock 실측 높이를 :root 변수로 공유.
  useEffect(() => {
    const el = navRef.current
    if (!el) return
    const update = () => {
      document.documentElement.style.setProperty('--dock-height', `${el.getBoundingClientRect().height}px`)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--dock-height')
    }
  }, [])

  return (
    <nav
      ref={navRef}
      aria-label="주요 메뉴"
      className="border-stroke-soft bg-bg-white/95 fixed inset-x-0 bottom-0 z-[var(--z-dock)] border-t pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-white/85 md:hidden"
    >
      <ul className="mx-auto flex max-w-[640px] items-stretch">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = item.match(pathname)
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 transition-colors ${
                  active ? 'text-text-strong' : 'text-text-soft'
                }`}
              >
                <Icon className={active ? 'text-icon-strong' : 'text-icon-soft'} />
                <span className={`text-[11px] leading-[14px] ${active ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
