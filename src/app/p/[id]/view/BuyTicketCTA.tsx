import { IcoExternal } from '@/shared/components/icons'

interface BuyTicketCTAProps {
  latitude: number
  longitude: number
}

/**
 * 주차장 미니맵 아래 주차권 구매 진입 버튼.
 * NEXT_PUBLIC_WEBAPP_HOST/map?lat={lat}&lng={lng} 외부 링크.
 */
export default function BuyTicketCTA({ latitude, longitude }: BuyTicketCTAProps) {
  const host = process.env.NEXT_PUBLIC_WEBAPP_HOST ?? ''
  const href = `${host}/map?lat=${latitude}&lng=${longitude}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-accent text-static-white border-fg inline-flex w-full items-center justify-center gap-2 border-[1.5px] px-5 py-3.5 text-sm font-bold tracking-tight transition-transform hover:-translate-y-px"
      style={{ boxShadow: '3px 3px 0 var(--color-fg)' }}
    >
      주차권 구매하기
      <IcoExternal className="size-3.5" />
    </a>
  )
}
