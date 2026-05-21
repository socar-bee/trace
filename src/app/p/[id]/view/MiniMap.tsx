'use client'

import { useEffect, useRef } from 'react'

import { useInitNaverSdk } from '@/shared/hooks/useInitNaverSdk'

interface MiniMapProps {
  name: string
  latitude: number
  longitude: number
}

/**
 * 주차장 위치 미니맵 — 네이버 지도 SDK 동적 로드.
 * SDK 로딩 전엔 grid placeholder + 좌표/scale 표시 (영수증 메타포 유지).
 */
export default function MiniMap({ name, latitude, longitude }: MiniMapProps) {
  const { isLoadScript } = useInitNaverSdk()
  const mapEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoadScript || !mapEl.current || !window.naver) return

    const naver = window.naver
    const center = new naver.maps.LatLng(latitude, longitude)
    const map = new naver.maps.Map(mapEl.current, {
      center,
      zoom: 16,
      zoomControl: false,
      mapDataControl: false,
      scaleControl: true,
      logoControl: false
    })

    const marker = new naver.maps.Marker({
      position: center,
      map,
      title: name
    })

    return () => {
      marker.setMap(null)
      map.destroy?.()
    }
  }, [isLoadScript, latitude, longitude, name])

  return (
    <div
      className="border-fg bg-bg-2 relative aspect-[4/3] w-full overflow-hidden border-2"
      style={{ boxShadow: '3px 3px 0 var(--color-fg)' }}
      aria-label={`${name} 미니맵`}
    >
      {/* Naver map (SDK 로드 후 렌더) */}
      <div ref={mapEl} className="size-full" />

      {/* Fallback grid placeholder — SDK 로드 전엔 위에 깔림 */}
      {!isLoadScript && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(0deg, transparent 0px, transparent 38px, var(--color-fg-3) 38px, var(--color-fg-3) 40px), linear-gradient(90deg, transparent 0px, transparent 38px, var(--color-fg-3) 38px, var(--color-fg-3) 40px)',
            backgroundSize: '40px 40px, 40px 40px'
          }}
          aria-hidden
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
            <span className="border-fg bg-accent block size-4 border-2" />
          </div>
          <div className="bg-bg border-line text-fg-3 absolute bottom-2.5 left-2.5 border px-1.5 py-1 font-mono text-[9px]">
            {latitude.toFixed(4)}°N · {longitude.toFixed(4)}°E
          </div>
        </div>
      )}
    </div>
  )
}
