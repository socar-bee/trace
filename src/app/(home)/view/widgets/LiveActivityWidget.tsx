'use client'

import Link from 'next/link'

import { formatRelativeTime } from '@/shared/lib/format'

import type { LiveActivity } from '@/shared/mocks/api'

import WidgetCard from './WidgetCard'

interface Props {
  activities: LiveActivity[]
}

const COLORS = [
  'bg-brand-500',
  'bg-orange-500',
  'bg-accent-600',
  'bg-purple-600',
  'bg-mint-700',
  'bg-red-500',
  'bg-yellow-700'
] as const

function colorFor(nickname: string) {
  let s = 0
  for (let i = 0; i < nickname.length; i++) s = (s * 31 + nickname.charCodeAt(i)) >>> 0
  return COLORS[s % COLORS.length]
}

export default function LiveActivityWidget({ activities }: Props) {
  return (
    <WidgetCard title="실시간 활동" className="h-full">
      <div className="border-stroke-soft mb-2 flex items-center justify-between border-b pb-2">
        <span className="text-text-soft text-xs">방금 후기 남긴 운전자</span>
        <span className="text-accent-700 inline-flex items-center gap-1 text-[11px] font-bold">
          <span className="bg-accent-500 size-1.5 animate-pulse rounded-full" />
          LIVE
        </span>
      </div>
      <ul className="-mx-1 flex flex-col gap-3 pt-1">
        {activities.map((a) => (
          <li key={a.id}>
            <Link
              href={`/p/${a.parkingLotSeq}`}
              className="hover:bg-bg-weak/60 group flex items-start gap-2.5 rounded-lg px-1 py-1.5 transition-colors"
            >
              <span
                className={`${colorFor(a.nickname)} inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white`}
              >
                {a.nickname.slice(0, 1)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-text-strong block text-[12px] leading-snug">
                  <span className="font-bold">{a.nickname}</span>
                  <span className="text-text-soft"> 님이 </span>
                  <span className="group-hover:text-brand-700 font-semibold transition-colors">{a.parkingLotName}</span>
                  <span className="text-text-soft"> 에 후기 남김</span>
                </span>
                <span className="text-text-soft mt-0.5 flex items-center gap-1.5 text-[10px]">
                  <span className="tabular-nums">⭐ {a.rating.toFixed(1)}</span>
                  <span>·</span>
                  <span>{formatRelativeTime(a.createdAt)}</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </WidgetCard>
  )
}
