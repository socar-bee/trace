import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showSubtitle?: boolean
  asLink?: boolean
}

const sizeMap = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl'
} as const

export default function Logo({ size = 'md', showSubtitle = false, asLink = true }: LogoProps) {
  const inner = (
    <span className="inline-flex items-baseline gap-1.5">
      <span className={`${sizeMap[size]} text-text-strong font-bold tracking-tight`}>Trace</span>
      {showSubtitle && <span className="text-text-soft hidden text-xs font-medium md:inline">주차장 흔적</span>}
    </span>
  )
  if (!asLink) return inner
  return (
    <Link href="/" aria-label="Trace 홈" className="inline-flex items-center">
      {inner}
    </Link>
  )
}
