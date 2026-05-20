import type { ParkingLotDetailResult } from '@/shared/mocks/api'

interface ReviewJsonLdProps {
  detail: ParkingLotDetailResult
}

export default function ReviewJsonLd({ detail }: ReviewJsonLdProps) {
  const { info, stats, reviews } = detail
  const json: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://trace.modu.kr/p/${info.seq}`,
    name: info.name,
    address: info.address,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: info.latitude,
      longitude: info.longitude
    }
  }
  if (stats.totalReviewCount > 0) {
    json.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: stats.avgRating,
      reviewCount: stats.totalReviewCount
    }
    json.review = reviews.slice(0, 5).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.nickname },
      datePublished: r.createdAt,
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.content ?? undefined
    }))
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
}
