import Link from 'next/link'

import { IcoTireMark } from '@/shared/components/icons'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showSubtitle?: boolean
  asLink?: boolean
}

const SIZE_MAP = {
  sm: { text: 'text-lg', mark: 16 },
  md: { text: 'text-xl', mark: 20 },
  lg: { text: 'text-3xl md:text-4xl', mark: 28 }
} as const

export default function Logo({ size = 'md', showSubtitle = false, asLink = true }: LogoProps) {
  const cfg = SIZE_MAP[size]
  const inner = (
    <span className="inline-flex items-baseline gap-1">
      <span className={`${cfg.text} text-text-strong font-black tracking-tighter`}>Trace</span>
      {/* 마침표 자리 → 바퀴 후기 시그너처 */}
      <IcoTireMark className="text-brand-500 mb-0.5" width={cfg.mark} height={cfg.mark * 0.27} />
      {showSubtitle && <span className="text-text-soft hidden text-[11px] font-medium md:inline">주차장 후기</span>}
    </span>
  )
  if (!asLink) return inner
  return (
    <Link href="/" aria-label="Trace 홈" className="inline-flex items-center">
      {inner}
    </Link>
  )
}
