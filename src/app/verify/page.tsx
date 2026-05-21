import AppFooter from '@/shared/components/layout/AppFooter'
import AppHeader from '@/shared/components/layout/AppHeader'

import type { Metadata } from 'next'

import { VerifyView } from './view'

export const metadata: Metadata = {
  title: '영수증 검증',
  description: '영수증·이용내역을 첨부하면 AI가 자동으로 검증해드려요.',
  robots: { index: false, follow: false }
}

interface PageProps {
  searchParams: Promise<{ onboard?: string }>
}

export default async function VerifyPage({ searchParams }: PageProps) {
  const { onboard } = await searchParams
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <VerifyView onboard={onboard === '1'} />
      <AppFooter />
    </div>
  )
}
