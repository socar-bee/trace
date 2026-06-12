# FSD 럭키드로우 이벤트 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 퀘스트형 응모권 적립 + 리더보드 + 가중 추첨 안내 구조의 FSD 럭키드로우 이벤트를 Trace에 mock 기반으로 구현한다.

**Architecture:** 기존 MVVM 라우트 패턴(`page.tsx` thin shell + `view/` + `viewmodel/`)을 따라 `/event/fsd-draw` 허브와 `/event/fsd-draw/leaderboard`를 추가한다. 퀘스트 정의·이벤트 메타·랭커 풀은 `src/shared/mocks/event.ts`, 응모권 적립(캡/중복 판정 포함)은 `src/shared/lib/ticket-storage.ts`(localStorage), 리더보드 조회는 `src/shared/mocks/api.ts`에 둔다. 기존 write/signup/verify viewmodel의 성공 지점에 적립 호출을 1줄씩 후킹한다.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind(영수증 톤 토큰: `bg-bg`, `text-fg`, `border-line`, `bg-accent` 계열) · Zustand(`useAuthStore`) · localStorage.

**스펙 대비 조정 2건** (구현 컨벤션 정렬, [spec](../specs/2026-06-12-fsd-draw-event-design.md) 의도 유지):

1. 라우트 내 `model/` 디렉토리 대신 `src/shared/mocks/event.ts` + `src/shared/lib/ticket-storage.ts` 사용 — 퀘스트 정의를 shared lib(ticket-storage)·기존 viewmodel들이 import해야 하므로 app 라우트 내부에 둘 수 없음. 실제 코드베이스도 write/verify가 같은 방식(`routes.ts`/`model` 없이 shared mocks 직접 import).
2. 친구 초대 데모는 DemoSwitcher 연계 대신 **퀘스트 카드 안의 데모 버튼**("친구 가입 완료(데모)")으로 처리 — 별도 dev 컴포넌트 수정 없이 자체 완결.

**검증 방식:** 이 레포는 테스트 러너 미설정(프로젝트 컨벤션). 각 태스크는 `pnpm type-check` + `pnpm lint`로 검증하고, 마지막 태스크에서 dev 서버(포트 5173)로 전체 플로우를 수동 검증한다. TypeScript 편집 후 import 순서는 `pnpm eslint src --ext .ts,.tsx --fix`로 정리한다.

---

## File Structure

```
src/shared/types/event.ts                 # [신규] 이벤트·퀘스트·응모권·리더보드 타입
src/shared/mocks/event.ts                 # [신규] 이벤트 메타·퀘스트 정의·랭커 풀·상태 계산
src/shared/lib/ticket-storage.ts          # [신규] 응모권 CRUD + 캡/중복 판정 (localStorage)
src/shared/mocks/api.ts                   # [수정] fetchEventLeaderboard 추가
src/shared/components/icons.tsx           # [수정] IcoTicket 추가
src/shared/components/layout/AppHeader.tsx # [수정] GNB '이벤트' 링크
src/shared/components/layout/DockBar.tsx  # [수정] 모바일 '이벤트' 탭
src/app/event/fsd-draw/
  viewmodel/{useEventHubViewModel.ts,index.ts}   # [신규]
  view/{EventHubView.tsx,EventHero.tsx,PrizeSection.tsx,QuestList.tsx,LeaderboardPreview.tsx,index.ts} # [신규]
  page.tsx                                       # [신규] thin shell
  leaderboard/
    viewmodel/{useLeaderboardViewModel.ts,index.ts} # [신규]
    view/{LeaderboardView.tsx,index.ts}             # [신규]
    page.tsx                                        # [신규]
src/app/write/viewmodel/useWriteViewModel.ts   # [수정] 후기 적립 후킹 1줄
src/app/signup/viewmodel/useSignupViewModel.ts # [수정] 가입 적립 후킹 1줄
src/app/verify/viewmodel/useVerifyViewModel.ts # [수정] 인증 적립 후킹 1줄
```

---

### Task 1: 이벤트 타입 정의

**Files:**

- Create: `src/shared/types/event.ts`

- [ ] **Step 1: 타입 파일 작성**

```ts
export type EventQuestId = 'enter' | 'signup' | 'review' | 'verify' | 'invite'

export type EventStatus = 'upcoming' | 'active' | 'ended'

/**
 * 퀘스트 적립 한도.
 * - once: 평생 1회 (enter, signup)
 * - daily: 하루 limit건 (review)
 * - total: 누적 limit건 (invite)
 * - unlimited: 횟수 제한 없음 — refId 중복만 막음 (verify: 인증 건당 1회)
 */
export type QuestCap =
  | { kind: 'once' }
  | { kind: 'daily'; limit: number }
  | { kind: 'total'; limit: number }
  | { kind: 'unlimited' }

export interface EventQuestDef {
  id: EventQuestId
  title: string
  description: string
  /** 1회 적립 응모권 수 */
  tickets: number
  cap: QuestCap
  cta?: { label: string; href: string }
}

export interface EntryTicket {
  id: string
  questId: EventQuestId
  amount: number
  earnedAt: string // ISO
  /** 동일 행위 중복 적립 방지 키 (예: review id, 인증 건 식별자) */
  refId?: string
}

export type EarnFailureReason = 'duplicate' | 'capped' | 'event-closed'

export type EarnResult = { ok: true; ticket: EntryTicket; total: number } | { ok: false; reason: EarnFailureReason }

export interface LeaderboardEntry {
  rank: number
  maskedNickname: string
  tickets: number
  isMe?: boolean
}

export interface EventLeaderboard {
  entries: LeaderboardEntry[]
  myRank: number | null
  myTickets: number
  totalParticipants: number
}
```

- [ ] **Step 2: 타입 체크**

Run: `pnpm type-check`
Expected: 에러 0 (신규 파일, 참조 없음)

- [ ] **Step 3: Commit**

```bash
git add src/shared/types/event.ts
git commit -m "feat(event): 럭키드로우 이벤트 타입 정의"
```

---

### Task 2: 이벤트 mock — 메타·퀘스트·랭커 풀

**Files:**

- Create: `src/shared/mocks/event.ts`

- [ ] **Step 1: mock 파일 작성**

`generateNickname`은 `src/shared/lib/nickname.ts`의 기존 헬퍼(시드 → '초록자동차' 형태 한글 닉네임). `pseudoRandom`은 `src/shared/mocks/reviews.ts`와 동일한 FNV-1a 패턴(결정적 생성 — SSR/CSR 불일치 방지).

```ts
import { generateNickname } from '@/shared/lib/nickname'

import type { EventQuestDef, EventQuestId, EventStatus } from '@/shared/types/event'

export const FSD_EVENT = {
  id: 'fsd-draw',
  badge: 'LUCKY DRAW',
  title: '궁금했던 FSD\n한 달 동안 내 차처럼',
  subtitle: '모델X(FSD) 1개월 사용권 · 단 2명',
  periodLabel: '응모 6.22 – 7.5 · 발표 7.20',
  period: { start: '2026-06-22T00:00:00+09:00', end: '2026-07-05T23:59:59+09:00' },
  announceAt: '2026-07-20T11:00:00+09:00',
  /** 데모 환경: 기간과 무관하게 상태 고정. null이면 period 기준 계산 */
  demoStatus: 'active' as EventStatus | null
}

export const EVENT_QUESTS: EventQuestDef[] = [
  {
    id: 'enter',
    title: '이벤트 첫 방문',
    description: '로그인하고 이벤트에 들어오면 자동 적립',
    tickets: 1,
    cap: { kind: 'once' }
  },
  {
    id: 'signup',
    title: '회원가입',
    description: '신규 가입 시 1회 적립',
    tickets: 2,
    cap: { kind: 'once' },
    cta: { label: '가입하기', href: '/signup' }
  },
  {
    id: 'review',
    title: '후기 작성',
    description: '검증된 후기 1건당 적립 · 하루 3건까지',
    tickets: 3,
    cap: { kind: 'daily', limit: 3 },
    cta: { label: '후기 쓰기', href: '/write' }
  },
  {
    id: 'verify',
    title: '이용내역 인증',
    description: '주차 이용내역 인증 건당 적립',
    tickets: 2,
    cap: { kind: 'unlimited' },
    cta: { label: '인증하기', href: '/verify' }
  },
  {
    id: 'invite',
    title: '친구 초대',
    description: '친구가 가입을 완료하면 적립 · 최대 5명',
    tickets: 2,
    cap: { kind: 'total', limit: 5 }
  }
]

export const EVENT_QUEST_MAP: Record<EventQuestId, EventQuestDef> = Object.fromEntries(
  EVENT_QUESTS.map((q) => [q.id, q])
) as Record<EventQuestId, EventQuestDef>

export function getEventStatus(now = new Date()): EventStatus {
  if (FSD_EVENT.demoStatus) return FSD_EVENT.demoStatus
  if (now < new Date(FSD_EVENT.period.start)) return 'upcoming'
  if (now > new Date(FSD_EVENT.period.end)) return 'ended'
  return 'active'
}

export function maskNickname(name: string): string {
  return `${name.slice(0, 2)}**`
}

function pseudoRandom(seed: string): () => number {
  let s = 2166136261
  for (let i = 0; i < seed.length; i++) {
    s = Math.imul(s ^ seed.charCodeAt(i), 16777619) >>> 0
  }
  return () => {
    s = Math.imul(s ^ (s >>> 15), 2246822507) >>> 0
    s = Math.imul(s ^ (s >>> 13), 3266489909) >>> 0
    return ((s ^ (s >>> 16)) >>> 0) / 4294967296
  }
}

export interface MockRanker {
  maskedNickname: string
  tickets: number
}

const RANKER_COUNT = 42
/** 리더보드 풀 밖 일반 참여자 수 — "전체 N명 참여 중" 표기용 */
export const PARTICIPANT_BASE = 1284

/** 결정적 랭커 풀 — 거듭제곱 분포로 상위권을 얇게 만들어 자연스러운 랭킹 모양을 만든다. */
export function getMockRankers(): MockRanker[] {
  const rng = pseudoRandom('event:fsd-draw')
  const rankers: MockRanker[] = []
  for (let i = 0; i < RANKER_COUNT; i++) {
    const tickets = Math.max(1, Math.floor(Math.pow(rng(), 2.2) * 38) + 1)
    rankers.push({ maskedNickname: maskNickname(generateNickname(`event-ranker-${i}`)), tickets })
  }
  return rankers.sort((a, b) => b.tickets - a.tickets)
}
```

- [ ] **Step 2: 타입 체크 + lint**

Run: `pnpm type-check && pnpm eslint src/shared/mocks/event.ts --fix`
Expected: 에러 0

- [ ] **Step 3: Commit**

```bash
git add src/shared/mocks/event.ts
git commit -m "feat(event): 이벤트 메타·퀘스트 정의·mock 랭커 풀 추가"
```

---

### Task 3: 응모권 storage — 적립/캡/중복 판정

**Files:**

- Create: `src/shared/lib/ticket-storage.ts`

기존 `trace-storage.ts`·`recommend-storage.ts`와 같은 패턴: `'use client'` + `typeof window` 가드 + try/catch 파싱.

- [ ] **Step 1: storage 파일 작성**

```ts
'use client'

import { EVENT_QUEST_MAP, getEventStatus } from '@/shared/mocks/event'

import type { EarnResult, EntryTicket, EventQuestId } from '@/shared/types/event'

const ENTRY_TICKETS_KEY = 'trace_entry_tickets'

export function getEntryTickets(): EntryTicket[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(ENTRY_TICKETS_KEY) ?? '[]') as EntryTicket[]
  } catch {
    return []
  }
}

export function getTicketTotal(): number {
  return getEntryTickets().reduce((acc, t) => acc + t.amount, 0)
}

/** questId별 적립 "건수" (응모권 장수 아님 — 캡 판정용) */
export function getQuestEarnCounts(): Record<EventQuestId, number> {
  const counts: Record<EventQuestId, number> = { enter: 0, signup: 0, review: 0, verify: 0, invite: 0 }
  for (const t of getEntryTickets()) counts[t.questId] += 1
  return counts
}

function isSameLocalDay(iso: string, now: Date): boolean {
  const d = new Date(iso)
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

/**
 * 퀘스트 달성 → 응모권 적립. 캡/중복 판정 포함.
 * 실패해도 호출부 흐름을 막지 않도록 항상 EarnResult 반환 (throw 없음).
 */
export function earnTickets(questId: EventQuestId, refId?: string): EarnResult {
  if (typeof window === 'undefined') return { ok: false, reason: 'event-closed' }
  if (getEventStatus() !== 'active') return { ok: false, reason: 'event-closed' }

  const quest = EVENT_QUEST_MAP[questId]
  const existing = getEntryTickets()
  if (refId && existing.some((t) => t.questId === questId && t.refId === refId)) {
    return { ok: false, reason: 'duplicate' }
  }

  const sameQuest = existing.filter((t) => t.questId === questId)
  const now = new Date()
  if (quest.cap.kind === 'once' && sameQuest.length > 0) return { ok: false, reason: 'duplicate' }
  if (
    quest.cap.kind === 'daily' &&
    sameQuest.filter((t) => isSameLocalDay(t.earnedAt, now)).length >= quest.cap.limit
  ) {
    return { ok: false, reason: 'capped' }
  }
  if (quest.cap.kind === 'total' && sameQuest.length >= quest.cap.limit) return { ok: false, reason: 'capped' }

  const ticket: EntryTicket = {
    id: `tk-${questId}-${now.getTime()}`,
    questId,
    amount: quest.tickets,
    earnedAt: now.toISOString(),
    refId
  }
  localStorage.setItem(ENTRY_TICKETS_KEY, JSON.stringify([ticket, ...existing]))
  return { ok: true, ticket, total: getTicketTotal() }
}

/** 오늘 review 퀘스트가 일일 캡에 도달했는지 — 퀘스트 카드 "오늘 한도 도달" 표기용 */
export function isReviewCappedToday(now = new Date()): boolean {
  const cap = EVENT_QUEST_MAP.review.cap
  if (cap.kind !== 'daily') return false
  return getEntryTickets().filter((t) => t.questId === 'review' && isSameLocalDay(t.earnedAt, now)).length >= cap.limit
}
```

- [ ] **Step 2: 타입 체크 + lint**

Run: `pnpm type-check && pnpm eslint src/shared/lib/ticket-storage.ts --fix`
Expected: 에러 0

- [ ] **Step 3: Commit**

```bash
git add src/shared/lib/ticket-storage.ts
git commit -m "feat(event): 응모권 적립 storage — 캡·중복 판정 포함"
```

---

### Task 4: 리더보드 mock API

**Files:**

- Modify: `src/shared/mocks/api.ts` (파일 끝에 추가)

- [ ] **Step 1: `fetchEventLeaderboard` 추가**

`src/shared/mocks/api.ts` 끝에 추가. import 구문은 파일 상단 기존 import 블록에 합친다:

```ts
import { PARTICIPANT_BASE, getMockRankers } from './event'
```

타입 import도 상단 타입 import 블록에 추가:

```ts
import type { EventLeaderboard, LeaderboardEntry } from '@/shared/types/event'
```

함수 본문 (파일 끝):

```ts
/**
 * 이벤트 리더보드 — 결정적 랭커 풀에 내 응모권 수를 끼워 내 순위를 계산한다.
 * 동률이면 isMe 우선 (mock 랭커는 timestamp가 없어 "최근 적립 우선" 규칙을 isMe로 근사).
 */
export async function fetchEventLeaderboard(myTickets: number, limit = 50): Promise<EventLeaderboard> {
  const pool: LeaderboardEntry[] = getMockRankers().map((r) => ({
    rank: 0,
    maskedNickname: r.maskedNickname,
    tickets: r.tickets
  }))
  if (myTickets > 0) {
    pool.push({ rank: 0, maskedNickname: '나', tickets: myTickets, isMe: true })
  }
  pool.sort((a, b) => b.tickets - a.tickets || (a.isMe ? -1 : b.isMe ? 1 : 0))
  const entries = pool.map((e, i) => ({ ...e, rank: i + 1 }))
  return {
    entries: entries.slice(0, limit),
    myRank: entries.find((e) => e.isMe)?.rank ?? null,
    myTickets,
    totalParticipants: PARTICIPANT_BASE + entries.length
  }
}
```

- [ ] **Step 2: 타입 체크 + lint**

Run: `pnpm type-check && pnpm eslint src/shared/mocks/api.ts --fix`
Expected: 에러 0

- [ ] **Step 3: Commit**

```bash
git add src/shared/mocks/api.ts
git commit -m "feat(event): 리더보드 mock API — 내 순위 합산 계산"
```

---

### Task 5: IcoTicket 아이콘 + 헤더·독바 이벤트 진입점

**Files:**

- Modify: `src/shared/components/icons.tsx` (파일 끝에 추가)
- Modify: `src/shared/components/layout/AppHeader.tsx:50` (nav 첫 항목으로 링크 추가)
- Modify: `src/shared/components/layout/DockBar.tsx:9-14` (NAV_ITEMS)

- [ ] **Step 1: IcoTicket 추가**

`icons.tsx` 파일 끝에 추가 (기존 컨벤션: 24 viewBox, stroke currentColor):

```tsx
export function IcoTicket(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3.5 8.5A1.5 1.5 0 0 1 5 7h14a1.5 1.5 0 0 1 1.5 1.5v1.25a2.25 2.25 0 0 0 0 4.5v1.25A1.5 1.5 0 0 1 19 17H5a1.5 1.5 0 0 1-1.5-1.5v-1.25a2.25 2.25 0 0 0 0-4.5V8.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14.5 7v10" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2.2 2.2" />
    </svg>
  )
}
```

- [ ] **Step 2: AppHeader에 '이벤트' 링크 추가**

`AppHeader.tsx`의 `<nav>` 블록 (line 50) 맨 앞, 로그인 분기 **바깥**에 추가 (로그인 여부 무관 노출):

```tsx
<nav className="ml-auto flex shrink-0 items-center gap-3 text-sm">
  <Link
    href="/event/fsd-draw"
    className="text-fg-2 hover:text-fg inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
  >
    <span className="bg-accent inline-block size-1.5 animate-pulse rounded-full" aria-hidden />
    이벤트
  </Link>
  {hydrated && isLoggedIn ? (
```

- [ ] **Step 3: DockBar에 '이벤트' 탭 추가**

`DockBar.tsx`의 `NAV_ITEMS`를 5탭으로 (import에 `IcoTicket` 추가):

```ts
import { IcoHome, IcoSearch, IcoTicket, IcoUser, IcoWrite } from '@/shared/components/icons'

const NAV_ITEMS = [
  { label: '홈', href: '/', icon: IcoHome, match: (p: string) => p === '/' },
  { label: '검색', href: '/search', icon: IcoSearch, match: (p: string) => p.startsWith('/search') },
  { label: '이벤트', href: '/event/fsd-draw', icon: IcoTicket, match: (p: string) => p.startsWith('/event') },
  { label: '후기', href: '/write', icon: IcoWrite, match: (p: string) => p.startsWith('/write') },
  { label: '내 후기', href: '/me/traces', icon: IcoUser, match: (p: string) => p.startsWith('/me') }
] as const
```

- [ ] **Step 4: 타입 체크 + lint**

Run: `pnpm type-check && pnpm eslint src/shared/components --ext .ts,.tsx --fix`
Expected: 에러 0. (이 시점엔 `/event/fsd-draw` 라우트가 아직 없어 404지만 빌드는 통과 — 다음 태스크에서 라우트 생성)

- [ ] **Step 5: Commit**

```bash
git add src/shared/components/icons.tsx src/shared/components/layout/AppHeader.tsx src/shared/components/layout/DockBar.tsx
git commit -m "feat(nav): 헤더 GNB·모바일 독바에 이벤트 진입점 추가"
```

---

### Task 6: 이벤트 허브 viewmodel

**Files:**

- Create: `src/app/event/fsd-draw/viewmodel/useEventHubViewModel.ts`
- Create: `src/app/event/fsd-draw/viewmodel/index.ts`

- [ ] **Step 1: viewmodel 작성**

hydration 안전 패턴은 `useVerifyViewModel.ts:12-14`와 동일(`useSyncExternalStore`). `setState`-in-effect는 기존 write viewmodel처럼 eslint-disable 주석으로 감싼다.

```ts
'use client'

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'

import { getQuestEarnCounts, getTicketTotal, earnTickets, isReviewCappedToday } from '@/shared/lib/ticket-storage'
import { useAuthStore } from '@/shared/stores/authStore'

import type { EventLeaderboard, EventQuestDef, EventQuestId } from '@/shared/types/event'

import { fetchEventLeaderboard } from '@/shared/mocks/api'
import { EVENT_QUESTS, FSD_EVENT, getEventStatus } from '@/shared/mocks/event'

const subscribe = () => () => {}
const getSnap = () => true
const getServerSnap = () => false

export interface QuestItemVM {
  def: EventQuestDef
  /** 적립 건수 (장수 아님) */
  earnCount: number
  /** once 퀘스트 완료 또는 total 캡 도달 */
  done: boolean
  /** daily 캡 도달 (오늘 한도) */
  cappedToday: boolean
}

export function useEventHubViewModel() {
  const hydrated = useSyncExternalStore(subscribe, getSnap, getServerSnap)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const status = getEventStatus()

  const [myTickets, setMyTickets] = useState(0)
  const [earnCounts, setEarnCounts] = useState<Record<EventQuestId, number>>({
    enter: 0,
    signup: 0,
    review: 0,
    verify: 0,
    invite: 0
  })
  const [reviewCapped, setReviewCapped] = useState(false)
  const [preview, setPreview] = useState<EventLeaderboard | null>(null)
  const [inviteCopied, setInviteCopied] = useState(false)

  const refresh = useCallback(() => {
    setMyTickets(getTicketTotal())
    setEarnCounts(getQuestEarnCounts())
    setReviewCapped(isReviewCappedToday())
  }, [])

  // 마운트 + 로그인 + 진행중이면 최초 진입 적립 (once 캡이라 재방문은 no-op)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!hydrated) return
    if (isLoggedIn && status === 'active') earnTickets('enter')
    refresh()
  }, [hydrated, isLoggedIn, status, refresh])
  /* eslint-enable react-hooks/set-state-in-effect */

  // 리더보드 프리뷰 — 내 응모권 수가 바뀔 때마다 갱신
  useEffect(() => {
    if (!hydrated) return
    let cancelled = false
    fetchEventLeaderboard(myTickets, 5).then((r) => {
      if (!cancelled) setPreview(r)
    })
    return () => {
      cancelled = true
    }
  }, [hydrated, myTickets])

  const quests: QuestItemVM[] = useMemo(
    () =>
      EVENT_QUESTS.map((def) => {
        const earnCount = earnCounts[def.id]
        const done =
          (def.cap.kind === 'once' && earnCount > 0) || (def.cap.kind === 'total' && earnCount >= def.cap.limit)
        return { def, earnCount, done, cappedToday: def.id === 'review' && reviewCapped }
      }),
    [earnCounts, reviewCapped]
  )

  const copyInviteLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/signup?ref=trace-invite`)
      setInviteCopied(true)
      setTimeout(() => setInviteCopied(false), 1600)
    } catch {
      // clipboard 권한 거부 — 조용히 무시 (데모 환경)
    }
  }, [])

  // 데모: 초대받은 친구의 가입 완료를 시뮬레이션
  const simulateInviteJoin = useCallback(() => {
    earnTickets('invite', `invite-${Date.now()}`)
    refresh()
  }, [refresh])

  return {
    event: FSD_EVENT,
    status,
    canRender: hydrated,
    isLoggedIn: hydrated && isLoggedIn,
    myTickets,
    quests,
    preview,
    inviteCopied,
    copyInviteLink,
    simulateInviteJoin
  }
}
```

- [ ] **Step 2: index.ts 작성**

```ts
export { useEventHubViewModel } from './useEventHubViewModel'
export type { QuestItemVM } from './useEventHubViewModel'
```

- [ ] **Step 3: 타입 체크 + lint**

Run: `pnpm type-check && pnpm eslint src/app/event --ext .ts,.tsx --fix`
Expected: 에러 0

- [ ] **Step 4: Commit**

```bash
git add src/app/event/fsd-draw/viewmodel
git commit -m "feat(event): 허브 viewmodel — 진입 적립·퀘스트 상태·리더보드 프리뷰"
```

---

### Task 7: 이벤트 허브 view + page

**Files:**

- Create: `src/app/event/fsd-draw/view/EventHero.tsx`
- Create: `src/app/event/fsd-draw/view/PrizeSection.tsx`
- Create: `src/app/event/fsd-draw/view/QuestList.tsx`
- Create: `src/app/event/fsd-draw/view/LeaderboardPreview.tsx`
- Create: `src/app/event/fsd-draw/view/EventHubView.tsx`
- Create: `src/app/event/fsd-draw/view/index.ts`
- Create: `src/app/event/fsd-draw/page.tsx`

영수증 톤: `font-mono` 라벨 + `border-line` 실선/`border-dashed` 절취선 + `bg-accent` 포인트 + `2px 2px 0 var(--color-fg)` 그림자. View는 viewmodel만 import (MVVM 규칙).

- [ ] **Step 1: EventHero.tsx**

MVVM 규칙(View는 viewmodel만 import — mocks 직접 의존 금지)에 따라 이벤트 텍스트는 전부 props로 받는다. EventHubView가 `vm.event`를 내려준다.

```tsx
import type { EventStatus } from '@/shared/types/event'

const STATUS_LABEL: Record<EventStatus, string> = {
  upcoming: 'OPENS SOON',
  active: 'NOW OPEN',
  ended: 'CLOSED'
}

interface EventHeroProps {
  status: EventStatus
  badge: string
  title: string
  subtitle: string
  periodLabel: string
}

export default function EventHero({ status, badge, title, subtitle, periodLabel }: EventHeroProps) {
  return (
    <section className="bg-fg text-static-white border-fg border-[1.5px] px-6 py-10 text-center">
      <p className="font-mono text-[11px] tracking-[0.4em]">
        {badge} · {STATUS_LABEL[status]}
      </p>
      <h1 className="mt-4 text-[28px] leading-[1.25] font-extrabold tracking-[-0.02em] whitespace-pre-line">{title}</h1>
      <p className="mt-3 text-sm opacity-80">{subtitle}</p>
      <p className="mt-6 inline-block border-t border-dashed border-white/40 pt-3 font-mono text-xs opacity-70">
        {periodLabel}
      </p>
      {status === 'upcoming' && (
        <p className="border-static-white/60 text-static-white mx-auto mt-4 w-fit border border-dashed px-3 py-1 font-mono text-xs font-bold">
          6.22 오픈 — 곧 응모를 시작해요
        </p>
      )}
      {status === 'ended' && (
        <p className="bg-accent text-static-white mx-auto mt-4 w-fit px-3 py-1 font-mono text-xs font-bold">
          응모 마감 — 7.20 발표를 기다려주세요
        </p>
      )}
    </section>
  )
}
```

- [ ] **Step 2: PrizeSection.tsx**

```tsx
const PRIZES = [
  {
    grade: '1등 · 2명',
    name: '테슬라 모델X(FSD) 1개월 사용권',
    desc: '쏘카 FSD 구독 제공 · 시가 310만원 상당',
    highlight: true
  },
  { grade: '2등 · 300명', name: '기프티콘 5천원권', desc: '모바일 쿠폰 발송', highlight: false },
  { grade: '전원', name: '주차 할인 쿠폰', desc: '최초 응모 시 1회 지급 (중복 불가)', highlight: false }
]

export default function PrizeSection() {
  return (
    <section className="mt-6">
      <h2 className="text-fg-3 font-mono text-xs tracking-[0.25em]">PRIZES — 경품 안내</h2>
      <ul className="mt-3 space-y-2.5">
        {PRIZES.map((p) => (
          <li
            key={p.grade}
            className={`border-[1.5px] px-4 py-3.5 ${p.highlight ? 'border-fg bg-bg' : 'border-line bg-bg'}`}
            style={p.highlight ? { boxShadow: '2px 2px 0 var(--color-fg)' } : undefined}
          >
            <p className={`font-mono text-[11px] font-bold ${p.highlight ? 'text-accent-500' : 'text-fg-3'}`}>
              {p.grade}
            </p>
            <p className="text-fg mt-1 text-[15px] font-bold">{p.name}</p>
            <p className="text-fg-3 mt-0.5 text-xs">{p.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 3: QuestList.tsx**

```tsx
import Link from 'next/link'

import type { QuestItemVM } from '../viewmodel'

interface QuestListProps {
  quests: QuestItemVM[]
  active: boolean
  inviteCopied: boolean
  onCopyInvite: () => void
  onSimulateInvite: () => void
}

function questStatusLabel(q: QuestItemVM): string | null {
  if (q.done) return '완료'
  if (q.cappedToday) return '오늘 한도 도달'
  return null
}

export default function QuestList({ quests, active, inviteCopied, onCopyInvite, onSimulateInvite }: QuestListProps) {
  return (
    <ul className="border-line divide-line divide-y border-[1.5px]">
      {quests.map((q) => {
        const statusLabel = questStatusLabel(q)
        const disabled = !active || q.done || q.cappedToday
        return (
          <li key={q.def.id} className="bg-bg flex items-center gap-3 px-4 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-fg flex items-baseline gap-2 text-sm font-bold">
                {q.def.title}
                <span className="text-accent-500 font-mono text-[11px]">+{q.def.tickets}장</span>
                {q.def.cap.kind === 'total' && (
                  <span className="text-fg-3 font-mono text-[10px]">
                    {q.earnCount}/{q.def.cap.limit}
                  </span>
                )}
              </p>
              <p className="text-fg-3 mt-0.5 text-xs">{q.def.description}</p>
            </div>
            {statusLabel ? (
              <span className="text-fg-3 shrink-0 font-mono text-[11px]">{statusLabel}</span>
            ) : q.def.id === 'invite' ? (
              <span className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={onCopyInvite}
                  disabled={!active}
                  className="border-line-2 hover:border-fg text-fg border-[1.5px] px-2.5 py-1.5 font-mono text-[11px] transition-colors disabled:opacity-40"
                >
                  {inviteCopied ? '복사됨' : '링크 복사'}
                </button>
                <button
                  type="button"
                  onClick={onSimulateInvite}
                  disabled={!active}
                  className="border-line-2 text-fg-3 hover:text-fg border-[1.5px] border-dashed px-2.5 py-1.5 font-mono text-[10px] transition-colors disabled:opacity-40"
                >
                  가입 완료(데모)
                </button>
              </span>
            ) : q.def.cta ? (
              <Link
                href={q.def.cta.href}
                aria-disabled={disabled}
                className={`border-[1.5px] px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                  disabled
                    ? 'border-line text-fg-3 pointer-events-none opacity-40'
                    : 'border-line-2 hover:border-fg text-fg'
                }`}
              >
                {q.def.cta.label}
              </Link>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
```

- [ ] **Step 4: LeaderboardPreview.tsx**

```tsx
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
```

- [ ] **Step 5: EventHubView.tsx**

```tsx
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
```

- [ ] **Step 6: view/index.ts**

```ts
export { default as EventHubView } from './EventHubView'
```

- [ ] **Step 7: page.tsx**

```tsx
import AppHeader from '@/shared/components/layout/AppHeader'

import type { Metadata } from 'next'

import { EventHubView } from './view'

export const metadata: Metadata = {
  title: '럭키드로우 — FSD 한 달 체험',
  description: '후기를 남기고 응모권을 모아 테슬라 모델X(FSD) 1개월 사용권에 도전하세요.'
}

export default function EventHubPage() {
  return (
    <div className="bg-bg-weak flex min-h-dvh flex-col">
      <AppHeader showSearch={false} />
      <EventHubView />
    </div>
  )
}
```

- [ ] **Step 8: 타입 체크 + lint + 렌더 확인**

Run: `pnpm type-check && pnpm eslint src/app/event --ext .ts,.tsx --fix`
Expected: 에러 0

Run(dev 서버 기동 후): `/event/fsd-draw` 접속
Expected: 히어로·경품·퀘스트(비로그인 CTA)·리더보드 프리뷰·유의사항 렌더, hydration 경고 없음

- [ ] **Step 9: Commit**

```bash
git add src/app/event/fsd-draw
git commit -m "feat(event): FSD 럭키드로우 허브 페이지 — 히어로·경품·퀘스트·프리뷰"
```

---

### Task 8: 리더보드 페이지

**Files:**

- Create: `src/app/event/fsd-draw/leaderboard/viewmodel/useLeaderboardViewModel.ts`
- Create: `src/app/event/fsd-draw/leaderboard/viewmodel/index.ts`
- Create: `src/app/event/fsd-draw/leaderboard/view/LeaderboardView.tsx`
- Create: `src/app/event/fsd-draw/leaderboard/view/index.ts`
- Create: `src/app/event/fsd-draw/leaderboard/page.tsx`

- [ ] **Step 1: useLeaderboardViewModel.ts**

```ts
'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

import { getTicketTotal } from '@/shared/lib/ticket-storage'
import { useAuthStore } from '@/shared/stores/authStore'

import type { EventLeaderboard } from '@/shared/types/event'

import { fetchEventLeaderboard } from '@/shared/mocks/api'

const subscribe = () => () => {}
const getSnap = () => true
const getServerSnap = () => false

export function useLeaderboardViewModel() {
  const hydrated = useSyncExternalStore(subscribe, getSnap, getServerSnap)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const [data, setData] = useState<EventLeaderboard | null>(null)

  useEffect(() => {
    if (!hydrated) return
    let cancelled = false
    fetchEventLeaderboard(getTicketTotal(), 50).then((r) => {
      if (!cancelled) setData(r)
    })
    return () => {
      cancelled = true
    }
  }, [hydrated])

  return { canRender: hydrated, isLoggedIn: hydrated && isLoggedIn, data }
}
```

- [ ] **Step 2: viewmodel/index.ts**

```ts
export { useLeaderboardViewModel } from './useLeaderboardViewModel'
```

- [ ] **Step 3: LeaderboardView.tsx**

```tsx
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
```

- [ ] **Step 4: view/index.ts**

```ts
export { default as LeaderboardView } from './LeaderboardView'
```

- [ ] **Step 5: page.tsx**

```tsx
import AppHeader from '@/shared/components/layout/AppHeader'

import type { Metadata } from 'next'

import { LeaderboardView } from './view'

export const metadata: Metadata = {
  title: '응모권 랭킹 — FSD 럭키드로우',
  description: 'FSD 럭키드로우 응모권 랭킹. 응모권이 많을수록 당첨 확률이 올라가요.',
  robots: { index: false, follow: false }
}

export default function LeaderboardPage() {
  return (
    <div className="bg-bg-weak flex min-h-dvh flex-col">
      <AppHeader showSearch={false} />
      <LeaderboardView />
    </div>
  )
}
```

- [ ] **Step 6: 타입 체크 + lint + 렌더 확인**

Run: `pnpm type-check && pnpm eslint src/app/event --ext .ts,.tsx --fix`
Expected: 에러 0. `/event/fsd-draw/leaderboard` 접속 시 랭킹 50행 + 내 순위 카드 렌더

- [ ] **Step 7: Commit**

```bash
git add src/app/event/fsd-draw/leaderboard
git commit -m "feat(event): 리더보드 페이지 — 전체 랭킹 + 내 순위 sticky"
```

---

### Task 9: 기존 viewmodel 적립 후킹 (write / signup / verify)

**Files:**

- Modify: `src/app/write/viewmodel/useWriteViewModel.ts:137` (submit 성공 직후)
- Modify: `src/app/signup/viewmodel/useSignupViewModel.ts:35-38` (persist 직후)
- Modify: `src/app/verify/viewmodel/useVerifyViewModel.ts:73-80` (finish)

각 파일에 import 1줄 추가:

```ts
import { earnTickets } from '@/shared/lib/ticket-storage'
```

- [ ] **Step 1: write — 후기 제출 성공 시 적립**

`useWriteViewModel.ts`의 `submit` 내 성공 분기 (`saveMyReview(result.review)` 직후, line 137). edit 모드는 위에서 early return 하므로 신규 작성만 적립된다:

```ts
saveMyReview(result.review)
earnTickets('review', result.review.id)
router.push(result.redirectUrl)
```

- [ ] **Step 2: signup — 가입 완료 시 적립**

`useSignupViewModel.ts`의 `persist` 함수 (line 35-38):

```ts
const persist = (result: SignupResult, provider: 'email' | 'kakao' | 'naver' | 'google') => {
  setTokens(`mock-access-${result.joinedAt}`, `mock-refresh-${result.joinedAt}`)
  setProfile(buildProfile(result, provider))
  earnTickets('signup')
}
```

- [ ] **Step 3: verify — 인증 완료 시 적립**

`useVerifyViewModel.ts`의 `finish` (line 73-80). refId는 인증 건 식별자(주차장+날짜+입차시각)로 같은 건 재인증 중복 적립 방지:

```ts
const finish = () => {
  if (!extracted) return
  // 검증 완료 → user의 isVerifiedUser true로 업데이트 (없으면 그대로)
  if (profile) {
    setProfile({ ...profile, isVerifiedUser: true })
  }
  earnTickets('verify', `${extracted.parkingLotSeq}-${extracted.date}-${extracted.enterAt}`)
  setTimeout(() => router.push(`/write?token=demo-${extracted.parkingLotSeq}`), 200)
}
```

- [ ] **Step 4: 타입 체크 + lint**

Run: `pnpm type-check && pnpm eslint src/app --ext .ts,.tsx --fix`
Expected: 에러 0

- [ ] **Step 5: Commit**

```bash
git add src/app/write/viewmodel/useWriteViewModel.ts src/app/signup/viewmodel/useSignupViewModel.ts src/app/verify/viewmodel/useVerifyViewModel.ts
git commit -m "feat(event): 후기·가입·인증 성공 시 응모권 적립 후킹"
```

---

### Task 10: 통합 검증 (수동 플로우)

**Files:** 없음 (검증만)

- [ ] **Step 1: 정적 검증**

Run: `pnpm type-check && pnpm lint`
Expected: 둘 다 통과

- [ ] **Step 2: dev 서버 기동**

Run: `pnpm dev` (포트 5173)

- [ ] **Step 3: 플로우 검증 — preview 도구 또는 브라우저로 아래 순서 확인**

| #   | 행동                                                      | 기대 결과                                                      |
| --- | --------------------------------------------------------- | -------------------------------------------------------------- |
| 1   | 비로그인으로 `/event/fsd-draw` 진입                       | 로그인 CTA 카드, 응모권 미적립, 헤더·독바에 이벤트 진입점 표시 |
| 2   | `/signup`에서 가입 (이메일 데모)                          | signup +2장 적립                                               |
| 3   | `/event/fsd-draw` 재진입                                  | enter +1장 자동 적립 → 보유 3장, '이벤트 첫 방문' 완료 표시    |
| 4   | `/verify` 인증 완료 → `/write?token=demo-…`에서 후기 제출 | verify +2장, review +3장 → 보유 8장                            |
| 5   | `/event/fsd-draw/leaderboard`                             | 내 순위 카드(8장 기준 순위), 랭킹 리스트에 '나' 하이라이트     |
| 6   | 허브에서 '가입 완료(데모)' 6회 클릭                       | 5회까지만 적립(invite 5/5), 6회째 무시                         |
| 7   | 같은 날 후기 3건 작성 후 4건째                            | review 적립 스킵, 퀘스트 카드 '오늘 한도 도달'                 |
| 8   | 허브 새로고침                                             | hydration 경고 없음, 응모권 수 유지                            |

- [ ] **Step 4: 콘솔/네트워크 에러 0 확인 후 종료**

Expected: preview console 에러 없음
