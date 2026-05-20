interface ParkingImagePlaceholderProps {
  seq: string
  name: string
  className?: string
  showName?: boolean
}

const GRADIENTS = [
  'from-brand-500 via-brand-700 to-brand-900',
  'from-orange-500 via-red-500 to-red-700',
  'from-accent-500 via-accent-700 to-mint-800',
  'from-purple-600 via-purple-800 to-brand-900',
  'from-mint-700 via-brand-700 to-brand-900',
  'from-yellow-700 via-orange-700 to-red-700',
  'from-purple-500 via-brand-600 to-mint-700',
  'from-red-500 via-purple-700 to-brand-800'
] as const

function seedHash(seed: string): number {
  let s = 2166136261
  for (let i = 0; i < seed.length; i++) {
    s = Math.imul(s ^ seed.charCodeAt(i), 16777619) >>> 0
  }
  return s >>> 0
}

/**
 * 이미지가 없는 주차장 카드용 fallback.
 * seq 기반 결정론적 그라데이션 + 큰 P 마크 + 옵션 주차장명.
 */
export default function ParkingImagePlaceholder({
  seq,
  name,
  className = '',
  showName = true
}: ParkingImagePlaceholderProps) {
  const gradient = GRADIENTS[seedHash(seq) % GRADIENTS.length]

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}>
      {/* glass highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 size-32 rounded-full bg-white/20 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-10 size-40 rounded-full bg-white/10 blur-3xl"
      />

      {/* Big P mark */}
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[140px] leading-none font-black text-white/15 select-none md:text-[180px]"
      >
        P
      </span>

      {showName && (
        <span className="absolute right-3 bottom-3 left-3 truncate text-[11px] font-bold text-white/95 drop-shadow-sm md:text-xs">
          {name}
        </span>
      )}
    </div>
  )
}
