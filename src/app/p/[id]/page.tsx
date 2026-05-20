import { notFound } from 'next/navigation'
import { cache } from 'react'

import AppFooter from '@/shared/components/layout/AppFooter'
import AppHeader from '@/shared/components/layout/AppHeader'

import { APP_HOST } from '@/shared/lib/constants'
import { META_KEYWORDS, buildParkingLotTitle } from '@/shared/lib/seo'

import type { Metadata } from 'next'

import { fetchParkingLotDetail } from '@/shared/mocks/api'

import ParkingDetailView from './view/ParkingDetailView'
import ReviewJsonLd from './view/ReviewJsonLd'

interface PageProps {
  params: Promise<{ id: string }>
}

export const revalidate = 600

const getDetail = cache((seq: string) => fetchParkingLotDetail(seq, { page: 1, pageSize: 8 }))

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const detail = await getDetail(id)
  if (!detail) return { title: '주차장을 찾을 수 없습니다' }

  const title = buildParkingLotTitle(detail.info.name)
  const desc =
    detail.stats.totalReviewCount > 0
      ? `${detail.info.name} 흔적 ${detail.stats.totalReviewCount}건 · 평균 ${detail.stats.avgRating.toFixed(1)}점. 가본 사람의 진짜 후기를 Trace에서 확인하세요.`
      : `${detail.info.name}의 첫 흔적을 남겨주세요. 주차권을 사용한 운전자만 글을 쓸 수 있는 익명 리뷰 플랫폼 Trace.`

  return {
    title,
    description: desc,
    keywords: META_KEYWORDS.PARKINGLOT_DETAIL,
    alternates: {
      canonical: `${APP_HOST}/p/${id}`
    },
    openGraph: {
      title,
      description: desc,
      type: 'website',
      url: `${APP_HOST}/p/${id}`
    }
  }
}

export default async function ParkingDetailPage({ params }: PageProps) {
  const { id } = await params
  const detail = await getDetail(id)
  if (!detail) notFound()

  return (
    <div className="flex min-h-dvh flex-col">
      <ReviewJsonLd detail={detail} />
      <AppHeader showSearch />
      <ParkingDetailView initial={detail} seq={id} />
      <AppFooter />
    </div>
  )
}
