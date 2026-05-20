import AppFooter from '@/shared/components/layout/AppFooter'
import AppHeader from '@/shared/components/layout/AppHeader'

import type { Metadata } from 'next'

import { searchParkingLotsWithStats } from '@/shared/mocks/api'

import SearchView from './view/SearchView'

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export const metadata: Metadata = {
  title: '주차장 검색',
  description: '주차장 이름이나 지역으로 후기를 찾아보세요.'
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const keyword = q?.trim() ?? ''

  const initialKeywordResults = keyword ? await searchParkingLotsWithStats(keyword) : []

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader showSearch />
      <SearchView initialKeyword={keyword} initialKeywordResults={initialKeywordResults} />
      <AppFooter />
    </div>
  )
}
