'use client'

import Link from 'next/link'

import { useLeaderboardViewModel } from '../viewmodel'

export default function LeaderboardView() {
  const vm = useLeaderboardViewModel()

  return (
    <main className="mx-auto w-full max-w-[640px] flex-1 px-4 pt-6 pb-28 md:px-0">
      <Link href="/event/fsd-draw" className="text-fg-3 hover:text-fg font-mono text-xs underline underline-offset-2">
        ← 이벤트로 돌아가기
      </Link>
      <h1 className="text-fg mt-3 text-xl font-extrabold tracking-[-0.02em]">응모권 랭킹</h1>
      <p className="text-fg-3 mt-1 text-xs">
        응모권이 많을수록 당첨 확률이 올라가요 — 순위가 당첨을 보장하지는 않아요.
      </p>

      {!vm.data ? null : (
        <>
          {/* 내 순위 — sticky 카드 */}
          <div
            className="border-fg bg-bg sticky top-[72px] z-10 mt-5 flex items-center justify-between border-[1.5px] px-4 py-3"
            style={{ boxShadow: '2px 2px 0 var(--color-fg)' }}
          >
            {vm.data.myRank ? (
              <>
                <span className="text-fg text-sm font-bold">내 순위 #{vm.data.myRank}</span>
                <span className="text-fg font-mono text-sm font-bold">{vm.data.myTickets}장</span>
              </>
            ) : (
              <>
                <span className="text-fg text-sm font-bold">아직 응모 전이에요</span>
                <Link
                  href="/event/fsd-draw"
                  className="text-accent-500 font-mono text-xs font-bold underline underline-offset-2"
                >
                  첫 응모권 받기 →
                </Link>
              </>
            )}
          </div>

          <ol className="border-line divide-line mt-4 divide-y border-[1.5px]">
            {vm.data.entries.map((e) => (
              <li
                key={`${e.rank}-${e.maskedNickname}`}
                className={`flex items-center gap-3 px-4 py-3 font-mono text-sm ${e.isMe ? 'bg-accent/10' : 'bg-bg'}`}
              >
                <span className={`w-10 shrink-0 text-xs ${e.rank <= 3 ? 'text-accent-500 font-bold' : 'text-fg-3'}`}>
                  #{e.rank}
                </span>
                <span className="text-fg flex-1 truncate">{e.isMe ? '나 (내 순위)' : e.maskedNickname}</span>
                <span className="text-fg shrink-0 text-xs font-bold">{e.tickets}장</span>
              </li>
            ))}
          </ol>
          <p className="text-fg-3 mt-3 text-center font-mono text-[11px]">
            전체 {vm.data.totalParticipants.toLocaleString('ko-KR')}명 참여 중 · 상위 50명 표시
          </p>
        </>
      )}
    </main>
  )
}
