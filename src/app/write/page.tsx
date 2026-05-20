import AppHeader from '@/shared/components/layout/AppHeader'

import type { Metadata } from 'next'

import { DEMO_TOKEN_HINTS } from '@/shared/mocks/tokens'

import WriteView from './view/WriteView'

export const metadata: Metadata = {
  title: '흔적 남기기',
  description: '주차권 사용 후 익명으로 흔적을 남겨보세요.',
  robots: { index: false, follow: false }
}

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function WritePage({ searchParams }: PageProps) {
  const { token } = await searchParams

  return (
    <div className="bg-bg-weak flex min-h-dvh flex-col">
      <AppHeader showSearch={false} />
      <WriteView token={token ?? null} demoTokens={DEMO_TOKEN_HINTS} />
    </div>
  )
}
