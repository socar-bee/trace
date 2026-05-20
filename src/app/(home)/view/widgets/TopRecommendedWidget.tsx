import Link from 'next/link'

import { IcoThumbsUp } from '@/shared/components/icons'
import ParkingImagePlaceholder from '@/shared/components/ui/ParkingImagePlaceholder'

import type { PopularParkingLot } from '@/shared/types/trace'

import WidgetCard from './WidgetCard'

interface Props {
  parkings: PopularParkingLot[]
}

export default function TopRecommendedWidget({ parkings }: Props) {
  return (
    <WidgetCard title="💚 가장 추천받는 곳" moreHref="/search">
      <ul className="grid grid-cols-3 gap-1.5">
        {parkings.slice(0, 6).map((p) => (
          <li key={p.seq} className="relative">
            <Link href={`/p/${p.seq}`} className="group block overflow-hidden rounded-lg">
              <ParkingImagePlaceholder
                seq={p.seq}
                name={p.name}
                showName={false}
                className="aspect-square w-full transition-transform group-hover:scale-110"
              />
              <span className="absolute inset-x-1 bottom-1 inline-flex items-center justify-center gap-0.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                <IcoThumbsUp className="size-2.5" filled />
                <span className="tabular-nums">{(p.recommendUpCount ?? 0).toLocaleString('ko-KR')}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </WidgetCard>
  )
}
