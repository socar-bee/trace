import Link from 'next/link'

import type { PopularParkingLot } from '@/shared/types/trace'

interface LotCardEditorialProps {
  lot: PopularParkingLot
  rank: number
}

export default function LotCardEditorial({ lot, rank }: LotCardEditorialProps) {
  const filled = Math.round(lot.avgRating)
  const stars = '★★★★★'.slice(0, filled)
  const starsOff = '★★★★★'.slice(filled)
  const code = `P${lot.seq}.${String(lot.totalReviewCount).padStart(4, '0')}`

  return (
    <Link href={`/p/${lot.seq}`} className="lot-receipt">
      <div className="lot-receipt__head">
        <div className="lot-receipt__name">{lot.name}</div>
        <div className="lot-receipt__sub">
          {lot.areaLabel ?? '—'} · NO.{String(rank).padStart(2, '0')}
        </div>
      </div>

      <hr className="lot-receipt__divider" />

      <div className="lot-receipt__rows">
        <div className="lot-receipt__row">
          <span className="lot-receipt__row-label">Rate</span>
          <span className="lot-receipt__row-leader" aria-hidden />
          <span className="lot-receipt__row-value">
            <span className="lot-receipt__stars">{stars}</span>
            <span className="lot-receipt__stars-off">{starsOff}</span>
            {'  '}
            {lot.avgRating.toFixed(1)}
          </span>
        </div>
        <div className="lot-receipt__row">
          <span className="lot-receipt__row-label">Logs</span>
          <span className="lot-receipt__row-leader" aria-hidden />
          <span className="lot-receipt__row-value">{lot.totalReviewCount}</span>
        </div>
        {lot.revisitRatePct != null && (
          <div className="lot-receipt__row">
            <span className="lot-receipt__row-label">Again</span>
            <span className="lot-receipt__row-leader" aria-hidden />
            <span className="lot-receipt__row-value">{lot.revisitRatePct}%</span>
          </div>
        )}
        {lot.pricePer != null && (
          <div className="lot-receipt__row lot-receipt__row--bold">
            <span className="lot-receipt__row-label">Rate/{lot.priceUnit ?? '10분'}</span>
            <span className="lot-receipt__row-leader" aria-hidden />
            <span className="lot-receipt__row-value">₩{lot.pricePer.toLocaleString('ko-KR')}</span>
          </div>
        )}
      </div>

      <hr className="lot-receipt__divider" />

      <div className={`lot-receipt__status ${lot.hot ? 'lot-receipt__status--hot' : ''}`}>
        {lot.hot ? '● ACTIVE · 이번 주 후기 多' : 'OPEN · 첫 후기 대기'}
      </div>

      <div className="lot-receipt__barcode">
        <div className="lot-receipt__barcode-bars" aria-hidden />
        <div className="lot-receipt__barcode-code">{code}</div>
      </div>
    </Link>
  )
}
