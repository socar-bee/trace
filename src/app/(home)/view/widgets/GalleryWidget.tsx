import Link from 'next/link'

import ParkingImagePlaceholder from '@/shared/components/ui/ParkingImagePlaceholder'
import { StarRatingDisplay } from '@/shared/components/ui/StarRating'

import { formatRating, formatRelativeTime } from '@/shared/lib/format'

import type { PopularParkingLot } from '@/shared/types/trace'

interface Props {
  parkings: PopularParkingLot[]
  recentTimestamps: Record<string, string>
}

import WidgetCard from './WidgetCard'

export default function GalleryWidget({ parkings, recentTimestamps }: Props) {
  return (
    <WidgetCard title="📸 주차장 갤러리" moreHref="/search">
      <ul className="grid grid-cols-2 gap-3">
        {parkings.slice(0, 4).map((p) => (
          <li key={p.seq}>
            <Link href={`/p/${p.seq}`} className="group block overflow-hidden rounded-xl">
              <ParkingImagePlaceholder
                seq={p.seq}
                name={p.name}
                showName={false}
                className="aspect-[4/3] w-full transition-transform group-hover:scale-105"
              />
              <div className="mt-2">
                <p className="text-text-strong truncate text-sm font-semibold">{p.name}</p>
                <p className="text-text-soft mt-0.5 flex items-center gap-1.5 text-[11px]">
                  <StarRatingDisplay value={p.avgRating} size={10} />
                  <span className="text-text-strong tabular-nums">{formatRating(p.avgRating)}</span>
                  <span>·</span>
                  <span>{recentTimestamps[p.seq] ? formatRelativeTime(recentTimestamps[p.seq]) : '최근'}</span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </WidgetCard>
  )
}
