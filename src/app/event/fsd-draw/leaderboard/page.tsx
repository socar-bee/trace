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
