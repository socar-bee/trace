'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface DemoLink {
  href: string
  label: string
  hint?: string
}

interface DemoSection {
  title: string
  desc: string
  links: DemoLink[]
}

const SECTIONS: DemoSection[] = [
  {
    title: 'Catalog',
    desc: '홈 / 검색 — 후기 카탈로그 진입점',
    links: [
      { href: '/', label: '홈', hint: '메인 카탈로그' },
      { href: '/search', label: '검색', hint: '주차장·지역 검색' }
    ]
  },
  {
    title: 'Reviews · 보기',
    desc: '작성된 후기가 모이는 주차장 상세 페이지',
    links: [
      { href: '/p/1024', label: '강남 N타워 지하주차장', hint: '/p/1024' },
      { href: '/p/1071', label: '잠실 롯데 P3', hint: '/p/1071' },
      { href: '/p/1037', label: '홍대입구 공영주차장', hint: '/p/1037' },
      { href: '/p/1052', label: '성수 연무장길 주차타워', hint: '/p/1052' },
      { href: '/p/1083', label: '여의도 IFC몰 B2', hint: '/p/1083' }
    ]
  },
  {
    title: 'Reviews · 작성',
    desc: '결제 직후 발급된 24h 토큰으로 진입하는 작성 화면',
    links: [
      { href: '/write?token=demo-1024', label: '강남 N타워', hint: 'token=demo-1024' },
      { href: '/write?token=demo-1071', label: '잠실 롯데 P3', hint: 'token=demo-1071' },
      { href: '/write?token=demo-1037', label: '홍대입구 공영', hint: 'token=demo-1037' },
      { href: '/write?token=demo-expired', label: '만료 토큰 (에러)', hint: 'token=demo-expired' },
      { href: '/write', label: '토큰 없는 진입 (no-token)', hint: '데모 진입 안내 화면' }
    ]
  },
  {
    title: 'Auth · 계정',
    desc: '인증·검증 풀스크린 흐름',
    links: [
      { href: '/login', label: '로그인' },
      { href: '/signup', label: '회원가입' },
      { href: '/verify', label: '본인 검증' },
      { href: '/me/traces', label: '내 후기' }
    ]
  }
]

export default function DemoSwitcher() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="데모 패널 닫기"
          className="demo-switcher__scrim"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="demo-switcher" data-open={open}>
        {open && (
          <div className="demo-switcher__panel" role="dialog" aria-label="UI 데모 스위처">
            <header className="demo-switcher__head">
              <div>
                <div className="demo-switcher__brand">
                  TRACE
                  <span className="demo-switcher__brand-dot" aria-hidden />
                </div>
                <div className="demo-switcher__sub">UI DEMO SWITCHER</div>
              </div>
              <button type="button" aria-label="닫기" onClick={() => setOpen(false)} className="demo-switcher__close">
                ✕
              </button>
            </header>

            <div className="demo-switcher__body">
              {SECTIONS.map((s) => (
                <section key={s.title} className="demo-switcher__section">
                  <div className="demo-switcher__section-title">{s.title}</div>
                  <div className="demo-switcher__section-desc">{s.desc}</div>
                  <ul className="demo-switcher__links">
                    {s.links.map((l) => {
                      const active =
                        l.href === pathname || (l.href.includes('?') && pathname + '?' === l.href.split('?')[0] + '?')
                      return (
                        <li key={l.href}>
                          <Link
                            href={l.href}
                            className="demo-switcher__link"
                            data-active={active}
                            onClick={() => setOpen(false)}
                          >
                            <span className="demo-switcher__link-label">{l.label}</span>
                            {l.hint && <span className="demo-switcher__link-hint">{l.hint}</span>}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              ))}
            </div>

            <footer className="demo-switcher__foot">
              ESC 또는 바깥 영역 클릭으로 닫기 · prod 빌드에서는 자동 숨김
            </footer>
          </div>
        )}

        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? '데모 패널 닫기' : 'UI 데모 패널 열기'}
          className="demo-switcher__fab"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="demo-switcher__fab-dot" aria-hidden />
          <span className="demo-switcher__fab-label">{open ? 'CLOSE' : 'DEMO'}</span>
        </button>
      </div>
    </>
  )
}
