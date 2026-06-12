import Link from 'next/link'

import type { EventLeaderboard } from '@/shared/types/event'

export default function LeaderboardPreview({ data }: { data: EventLeaderboard | null }) {
  if (!data) return null
  return (
    <section className="mt-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-fg-3 font-mono text-xs tracking-[0.25em]">LEADERBOARD — 응모권 랭킹</h2>
        <Link
          href="/event/fsd-draw/leaderboard"
          className="text-fg-2 hover:text-fg font-mono text-xs underline underline-offset-2"
        >
          전체 보기 →
        </Link>
      </div>
      <ol className="border-line divide-line mt-3 divide-y border-[1.5px]">
        {data.entries.map((e) => (
          <li
            key={`${e.rank}-${e.maskedNickname}`}
            className={`flex items-center gap-3 px-4 py-2.5 font-mono text-sm ${e.isMe ? 'bg-accent/10' : 'bg-bg'}`}
          >
            <span className="text-fg-3 w-8 shrink-0 text-xs">#{e.rank}</span>
            <span className="text-fg flex-1 truncate">{e.isMe ? '나 (내 순위)' : e.maskedNickname}</span>
            <span className="text-fg shrink-0 text-xs font-bold">{e.tickets}장</span>
          </li>
        ))}
      </ol>
      <p className="text-fg-3 mt-2 font-mono text-[11px]">
        {data.myRank ? `내 순위 #${data.myRank}` : '아직 응모 전'} · 전체{' '}
        {data.totalParticipants.toLocaleString('ko-KR')}명 참여 중
      </p>
    </section>
  )
}
