import Link from 'next/link'

import { IcoChevronRight } from '@/shared/components/icons'

import type { ReactNode } from 'react'

interface WidgetCardProps {
  title: string
  moreHref?: string
  moreLabel?: string
  children: ReactNode
  className?: string
}

export default function WidgetCard({
  title,
  moreHref,
  moreLabel = '더보기',
  children,
  className = ''
}: WidgetCardProps) {
  return (
    <section
      className={`border-stroke-soft hover:border-stroke-sub flex flex-col rounded-2xl border bg-white p-5 transition-colors md:p-6 ${className}`}
    >
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="text-text-strong text-base font-bold tracking-tight md:text-lg">{title}</h2>
        {moreHref && (
          <Link
            href={moreHref}
            className="text-text-soft hover:text-brand-700 inline-flex items-center gap-0.5 text-xs font-medium transition-colors"
          >
            {moreLabel}
            <IcoChevronRight className="size-3" />
          </Link>
        )}
      </header>
      {children}
    </section>
  )
}
