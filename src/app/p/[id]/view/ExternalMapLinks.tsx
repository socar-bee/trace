import { IcoExternal } from '@/shared/components/icons'

interface ExternalMapLinksProps {
  name: string
  latitude: number
  longitude: number
}

export default function ExternalMapLinks({ name, latitude, longitude }: ExternalMapLinksProps) {
  const naver = `https://map.naver.com/v5/search/${encodeURIComponent(name)}?lng=${longitude}&lat=${latitude}`
  const kakao = `https://map.kakao.com/link/map/${encodeURIComponent(name)},${latitude},${longitude}`

  return (
    <div className="flex gap-2">
      <a
        href={naver}
        target="_blank"
        rel="noopener noreferrer"
        className="border-stroke-sub hover:bg-bg-soft text-text-strong inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border bg-white px-3 py-2.5 text-sm font-medium transition-colors"
      >
        네이버 지도
        <IcoExternal className="text-icon-soft" />
      </a>
      <a
        href={kakao}
        target="_blank"
        rel="noopener noreferrer"
        className="border-stroke-sub hover:bg-bg-soft text-text-strong inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border bg-white px-3 py-2.5 text-sm font-medium transition-colors"
      >
        카카오맵
        <IcoExternal className="text-icon-soft" />
      </a>
    </div>
  )
}
