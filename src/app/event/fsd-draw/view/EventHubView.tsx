'use client'

import { IcoTicket } from '@/shared/components/icons'

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
        canRender={vm.canRender}
        isLoggedIn={vm.isLoggedIn}
        hasEntered={vm.hasEntered}
        myTickets={vm.myTickets}
        loginHref="/login?return=/event/fsd-draw"
        onEnter={vm.enterDraw}
      />

      <PrizeSection />

      <section className="mt-8">
        <h2 className="text-fg-3 font-mono text-xs tracking-[0.25em]">MY ENTRY — 내 응모 현황</h2>
        {!vm.canRender ? null : vm.isLoggedIn ? (
          <>
            <div
              className="evt-pop border-fg bg-fg text-static-white mt-3 flex items-center justify-between overflow-hidden border-[1.5px] px-4 py-4"
              style={{ boxShadow: '2px 2px 0 var(--color-fg)' }}
            >
              <span className="flex items-center gap-2.5">
                <IcoTicket className="evt-float text-accent size-6" />
                <span className="flex flex-col">
                  <span className="text-sm font-bold">보유 응모권</span>
                  <span
                    className={`font-mono text-[10px] ${vm.hasEntered ? 'text-brand-300' : 'text-static-white/50'}`}
                  >
                    {vm.hasEntered ? '● 응모 완료 · 참여 중' : '아직 응모 전 — 위에서 응모하기'}
                  </span>
                </span>
              </span>
              <span className="font-mono text-2xl font-extrabold tracking-tight tabular-nums">
                {vm.myTickets}
                <span className="text-static-white/50 ml-1 text-xs font-medium">장</span>
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
          <div className="border-line bg-bg mt-3 border-[1.5px] border-dashed px-4 py-5 text-center">
            <p className="text-fg text-sm font-bold">로그인하면 퀘스트로 응모권을 모을 수 있어요</p>
            <p className="text-fg-3 mt-1 text-xs">
              위 <span className="text-brand-600 font-semibold">응모하기</span> 버튼으로 시작하세요. 후기·인증·초대마다
              응모권이 쌓여요.
            </p>
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
