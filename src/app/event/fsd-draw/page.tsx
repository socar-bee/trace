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
