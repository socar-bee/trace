'use client'

import Link from 'next/link'

import { useEventHubViewModel } from '../viewmodel'

import EventHero from './EventHero'
import LeaderboardPreview from './LeaderboardPreview'
import PrizeSection from './PrizeSection'
import QuestList from './QuestList'

const NOTICES = [
  '응모권이 많을수록 당첨 확률이 올라가요. 순위가 당첨을 보장하지는 않아요 (가중 추첨).',
  '당첨자는 7.20(월) 발표 — 등록된 연락처로 개별 안내해요.',
  '주차 할인 쿠폰은 최초 응모 시 1회만 지급돼요.',
  '부정 참여(허위 후기 등)로 판단되면 응모가 취소될 수 있어요.'
]

export default function EventHubView() {
  const vm = useEventHubViewModel()
  const active = vm.status === 'active'

  return (
    <main className="mx-auto w-full max-w-[640px] flex-1 px-4 pt-6 pb-28 md:px-0">
      <EventHero
        status={vm.status}
        badge={vm.event.badge}
        title={vm.event.title}
        subtitle={vm.event.subtitle}
        periodLabel={vm.event.periodLabel}
      />

      <PrizeSection />

      <section className="mt-8">
        <h2 className="text-fg-3 font-mono text-xs tracking-[0.25em]">MY ENTRY — 내 응모 현황</h2>
        {!vm.canRender ? null : vm.isLoggedIn ? (
          <>
            <div
              className="border-fg bg-bg mt-3 flex items-baseline justify-between border-[1.5px] px-4 py-3.5"
              style={{ boxShadow: '2px 2px 0 var(--color-fg)' }}
            >
              <span className="text-fg text-sm font-bold">보유 응모권</span>
              <span className="text-fg font-mono text-xl font-extrabold">
                {vm.myTickets}
                <span className="text-fg-3 ml-1 text-xs font-medium">장</span>
              </span>
            </div>
            <div className="mt-2.5">
              <QuestList
                quests={vm.quests}
                active={active}
                inviteCopied={vm.inviteCopied}
                onCopyInvite={vm.copyInviteLink}
                onSimulateInvite={vm.simulateInviteJoin}
              />
            </div>
          </>
        ) : (
          <div className="border-line bg-bg mt-3 border-[1.5px] border-dashed px-4 py-6 text-center">
            <p className="text-fg text-sm font-bold">로그인하면 응모권 1장을 바로 드려요</p>
            <p className="text-fg-3 mt-1 text-xs">퀘스트를 달성할 때마다 응모권이 쌓여요.</p>
            <Link
              href="/login?return=/event/fsd-draw"
              className="bg-accent text-static-white border-fg mt-4 inline-block border-[1.5px] px-4 py-2 text-xs font-bold"
              style={{ boxShadow: '2px 2px 0 var(--color-fg)' }}
            >
              로그인하고 응모 시작
            </Link>
          </div>
        )}
      </section>

      <LeaderboardPreview data={vm.preview} />

      <section className="mt-8">
        <h2 className="text-fg-3 font-mono text-xs tracking-[0.25em]">NOTICE — 유의사항</h2>
        <ul className="text-fg-3 mt-3 list-disc space-y-1.5 pl-4 text-xs leading-relaxed">
          {NOTICES.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
