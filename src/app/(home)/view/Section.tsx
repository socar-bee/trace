import type { ReactNode } from 'react'

export type SectionTone = 'hot' | 'recommend' | 'weekly' | 'area' | 'neutral'

interface SectionProps {
  tone?: SectionTone
  emoji: string
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

const TONE_STYLES: Record<SectionTone, { iconBg: string; titleAccent: string; bg: string }> = {
  hot: {
    iconBg: 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-[0_4px_16px_rgba(229,57,53,0.35)]',
    titleAccent: 'text-red-700',
    bg: ''
  },
  recommend: {
    iconBg: 'bg-gradient-to-br from-accent-500 to-accent-700 text-white shadow-[0_4px_16px_rgba(34,197,94,0.35)]',
    titleAccent: 'text-accent-700',
    bg: ''
  },
  weekly: {
    iconBg: 'bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[0_4px_16px_rgba(0,153,255,0.35)]',
    titleAccent: 'text-brand-700',
    bg: ''
  },
  area: {
    iconBg: 'bg-gradient-to-br from-purple-500 to-brand-700 text-white shadow-[0_4px_16px_rgba(143,0,217,0.3)]',
    titleAccent: 'text-purple-800',
    bg: ''
  },
  neutral: {
    iconBg: 'bg-bg-strong text-white',
    titleAccent: 'text-text-strong',
    bg: ''
  }
}

export default function Section({
  tone = 'neutral',
  emoji,
  title,
  subtitle,
  action,
  children,
  className = ''
}: SectionProps) {
  const t = TONE_STYLES[tone]
  return (
    <section className={`py-9 md:py-12 ${t.bg} ${className}`}>
      <header className="mb-6 flex items-end justify-between gap-3 md:mb-8">
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          <span
            className={`${t.iconBg} inline-flex size-11 shrink-0 items-center justify-center rounded-2xl text-xl md:size-14 md:rounded-[20px] md:text-2xl`}
          >
            {emoji}
          </span>
          <div className="min-w-0">
            <h2 className="text-text-strong text-xl leading-tight font-black tracking-tight md:text-2xl">{title}</h2>
            {subtitle && <p className={`${t.titleAccent} mt-0.5 text-xs font-medium md:text-sm`}>{subtitle}</p>}
          </div>
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}
