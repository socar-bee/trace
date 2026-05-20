import { IcoMapPin } from '@/shared/components/icons'

interface MiniMapProps {
  name: string
  latitude: number
  longitude: number
}

function buildStaticMapUrl(lat: number, lng: number) {
  const clientId = process.env.NEXT_PUBLIC_NAVER_STATIC_MAP_CLIENT_ID
  if (!clientId) return null
  return `https://naveropenapi.apigw.ntruss.com/map-static/v2/raster?w=640&h=320&center=${lng},${lat}&level=16&markers=type:t|size:mid|pos:${lng}%20${lat}&X-NCP-APIGW-API-KEY-ID=${clientId}`
}

export default function MiniMap({ name, latitude, longitude }: MiniMapProps) {
  const url = buildStaticMapUrl(latitude, longitude)

  if (url) {
    return (
      <div className="bg-bg-soft border-stroke-soft relative aspect-[16/9] w-full overflow-hidden rounded-xl border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={`${name} 위치`} className="size-full object-cover" loading="lazy" />
      </div>
    )
  }

  return (
    <div className="bg-bg-soft border-stroke-soft from-bg-soft to-bg-sub relative aspect-[16/9] w-full overflow-hidden rounded-xl border bg-gradient-to-br">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <IcoMapPin className="text-icon-soft size-6" />
        <span className="text-text-soft text-xs">지도</span>
      </div>
      <div className="absolute right-3 bottom-3 left-3">
        <p className="text-text-strong truncate text-xs font-medium">{name}</p>
        <p className="text-text-soft truncate text-[11px]">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </p>
      </div>
    </div>
  )
}
