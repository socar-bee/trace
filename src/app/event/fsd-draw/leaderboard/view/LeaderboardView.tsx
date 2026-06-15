'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useLeaderboardViewModel } from '../viewmodel'
import type { LeaderboardEntry } from '@/shared/types/event'

type Place = 1 | 2 | 3

interface Medal {
  /** 카드 베이스 (흰 카드, 1등만 살짝 brand 틴트) */
  card: string
  /** 랭크 칩 (티어 색) */
  pill: string
  /** 코인 링 (티어 색) */
  ring: string
  /** 응모권 숫자 강조 */
  tickets: string
  big: boolean
  prize: string
  prizeFit: 'cover' | 'contain'
}

const MEDAL: Record<Place, Medal> = {
  // 흰 카드 + 티어 색은 포인트로만 (1등 블루·테슬라 / 2등 옐로우·기프티콘 / 3등 그린·모주로고)
  1: {
    card: 'bg-brand-50 border-brand-200',
    pill: 'bg-brand-500 text-static-white',
    ring: 'ring-brand-400',
    tickets: 'text-brand-700',
    big: true,
    prize: '/event/tesla-modelx.jpg',
    prizeFit: 'cover'
  },
  2: {
    card: 'bg-bg border-line',
    pill: 'bg-yellow-500 text-fg',
    ring: 'ring-yellow-500',
    tickets: 'text-fg',
    big: false,
    prize: '/event/gift.jpg',
    prizeFit: 'cover'
  },
  3: {
    card: 'bg-bg border-line',
    pill: 'bg-accent-600 text-static-white',
    ring: 'ring-accent-500',
    tickets: 'text-fg',
    big: false,
    prize: '/icons/icn_modu.svg',
    prizeFit: 'contain'
  }
}

function PodiumCard({ entry, place }: { entry: LeaderboardEntry; place: Place }) {
  const m = MEDAL[place]
  return (
    <div
      className={`evt-rise relative flex flex-col items-center rounded-2xl border px-1.5 text-center ${m.card} ${
        m.big ? 'pt-4 pb-4 shadow-md' : 'mt-8 pt-3.5 pb-3.5 shadow-sm'
      } ${entry.isMe ? 'ring-brand-500 ring-2 ring-offset-2' : ''}`}
      style={{ animationDelay: place === 1 ? '0s' : place === 2 ? '0.08s' : '0.16s' }}
    >
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${m.pill}`}>
        #{place}
      </span>

      {/* 경품 메달 코인 */}
      <span
        className={`relative mt-2.5 overflow-hidden rounded-full bg-white shadow-sm ring-2 ${m.ring} ${
          m.big ? 'size-16' : 'size-12'
        }`}
      >
        <Image
          src={m.prize}
          alt=""
          fill
          sizes="64px"
          aria-hidden
          className={m.prizeFit === 'contain' ? 'object-contain p-2' : 'object-cover object-center'}
        />
      </span>

      <span className="text-fg mt-2.5 max-w-full truncate px-1 text-[13px] font-bold">
        {entry.isMe ? '나' : entry.maskedNickname}
      </span>
      <span className={`mt-0.5 font-mono font-extrabold ${m.tickets} ${m.big ? 'text-2xl' : 'text-xl'}`}>
        {entry.tickets}
        <span className="text-fg-3 ml-0.5 text-[10px] font-medium">장</span>
      </span>
    </div>
  )
}

export default function LeaderboardView() {
  const vm = useLeaderboardViewModel()
  const entries = vm.data?.entries ?? []
  const hasPodium = entries.length >= 3
  const rest = hasPodium ? entries.slice(3) : entries

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
          {/* 내 순위 — sticky 카드 (응모 시 primary 강조) */}
          <div
            className={`sticky top-[72px] z-10 mt-5 flex items-center justify-between border-[1.5px] px-4 py-3 ${
              vm.data.myRank ? 'border-brand-500 bg-brand-50' : 'border-fg bg-bg'
            }`}
            style={{ boxShadow: vm.data.myRank ? '2px 2px 0 var(--color-brand-500)' : '2px 2px 0 var(--color-fg)' }}
          >
            {vm.data.myRank ? (
              <>
                <span className="text-brand-700 text-sm font-bold">내 순위 #{vm.data.myRank}</span>
                <span className="text-brand-700 font-mono text-sm font-bold">{vm.data.myTickets}장</span>
              </>
            ) : (
              <>
                <span className="text-fg text-sm font-bold">아직 응모 전이에요</span>
                <Link
                  href="/event/fsd-draw"
                  className="text-brand-600 font-mono text-xs font-bold underline underline-offset-2"
                >
                  첫 응모권 받기 →
                </Link>
              </>
            )}
          </div>

          {/* 포디움 — Top 3 (1위 중앙·금, 2위 좌·은, 3위 우·동) */}
          {hasPodium && (
            <div className="mt-6 grid grid-cols-3 items-end gap-2.5">
              <PodiumCard entry={entries[1]} place={2} />
              <PodiumCard entry={entries[0]} place={1} />
              <PodiumCard entry={entries[2]} place={3} />
            </div>
          )}

          {/* 4위 이하 리스트 */}
          <ol className="border-line divide-line mt-5 divide-y border-[1.5px]">
            {rest.map((e) => (
              <li
                key={`${e.rank}-${e.maskedNickname}`}
                className={`flex items-center gap-3 px-4 py-3 font-mono text-sm ${e.isMe ? 'bg-brand-50' : 'bg-bg'}`}
              >
                <span className={`w-10 shrink-0 text-xs ${e.isMe ? 'text-brand-600 font-bold' : 'text-fg-3'}`}>
                  #{e.rank}
                </span>
                <span className={`flex-1 truncate ${e.isMe ? 'text-brand-700 font-bold' : 'text-fg'}`}>
                  {e.isMe ? '나 (내 순위)' : e.maskedNickname}
                </span>
                <span className={`shrink-0 text-xs font-bold ${e.isMe ? 'text-brand-700' : 'text-fg'}`}>
                  {e.tickets}장
                </span>
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
