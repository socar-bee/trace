import AppFooter from '@/shared/components/layout/AppFooter'
import AppHeader from '@/shared/components/layout/AppHeader'

import type { Metadata } from 'next'

import MyTracesView from './view/MyTracesView'

export const metadata: Metadata = {
  title: '내 후기',
  description: '내가 남긴 주차장 후기 모음',
  robots: { index: false, follow: false }
}

export default function MyTracesPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader showSearch />
      <MyTracesView />
      <AppFooter />
    </div>
  )
}
