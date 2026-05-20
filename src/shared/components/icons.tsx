import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function IcoChevronRight(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IcoChevronLeft(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IcoClose(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IcoSearch(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IcoStar({ filled = true, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2.5l2.95 6.32 6.55.6-4.95 4.5 1.45 6.58L12 17.32l-6 3.18 1.45-6.58L2.5 9.42l6.55-.6L12 2.5z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IcoStarHalf(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
      <defs>
        <linearGradient id="half-star">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5l2.95 6.32 6.55.6-4.95 4.5 1.45 6.58L12 17.32l-6 3.18 1.45-6.58L2.5 9.42l6.55-.6L12 2.5z"
        fill="url(#half-star)"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IcoMapPin(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function IcoExternal(props: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IcoCheck(props: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="m5 12 5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * 바퀴 후기 — Trace 브랜드 시그너처 모티브.
 * 5 tread block이 도로에 찍힌 패턴. 로고 마침표 자리, 데코, strip overlay 등에 활용.
 */
export function IcoTireMark(props: IconProps) {
  return (
    <svg width="22" height="6" viewBox="0 0 22 6" fill="none" {...props}>
      <rect x="0" y="0" width="3" height="6" rx="1" fill="currentColor" />
      <rect x="4.75" y="0" width="3" height="6" rx="1" fill="currentColor" />
      <rect x="9.5" y="0" width="3" height="6" rx="1" fill="currentColor" />
      <rect x="14.25" y="0" width="3" height="6" rx="1" fill="currentColor" />
      <rect x="19" y="0" width="3" height="6" rx="1" fill="currentColor" />
    </svg>
  )
}

/**
 * 세로 바퀴 후기 — 카드 좌측 strip overlay 용.
 */
export function IcoTireMarkVertical(props: IconProps) {
  return (
    <svg width="6" height="48" viewBox="0 0 6 48" fill="none" {...props}>
      <rect x="0" y="0" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="0" y="8.5" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="0" y="17" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="0" y="25.5" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="0" y="34" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="0" y="42.5" width="6" height="6" rx="1" fill="currentColor" />
    </svg>
  )
}

/**
 * 차량이 멀어지며 남긴 타이어 자국 (원근감) — Hero 배경 시그너처 데코.
 * 두 lane × 10 block, 앞쪽이 크고 뒤로 갈수록 작아짐. 사선으로 흐름.
 * `currentColor` 사용 → `text-brand-500` 같이 색 제어.
 */
export function IcoTireTrail(props: IconProps) {
  const blocks = Array.from({ length: 11 }).map((_, i) => {
    const t = i / 10 // 0 (front) → 1 (back)
    const scale = 1 - t * 0.78 // front 1.0 → back 0.22
    const stepX = 38 // 블록 간 가로 이동량
    const stepY = -22 // 블록 간 세로 이동량 (위로 갈수록 작아짐)
    return {
      x: 40 + i * stepX * 0.78 + i * 4,
      y: 260 + i * stepY,
      w: 46 * scale,
      h: 22 * scale,
      gap: 4 * scale
    }
  })
  return (
    <svg width="640" height="320" viewBox="0 0 640 320" fill="none" {...props}>
      <g fill="currentColor">
        {/* 좌측 lane */}
        {blocks.map((b, i) => (
          <g key={`l-${i}`} transform={`translate(${b.x}, ${b.y})`}>
            <rect x="0" y="0" width={b.w} height={b.h} rx={b.h * 0.15} />
            {/* tread detail — 가는 빗금 (V자 흉내) */}
            <rect x={b.w * 0.18} y={b.h * 0.2} width={b.w * 0.08} height={b.h * 0.6} fill="white" opacity="0.35" />
            <rect x={b.w * 0.46} y={b.h * 0.2} width={b.w * 0.08} height={b.h * 0.6} fill="white" opacity="0.35" />
            <rect x={b.w * 0.74} y={b.h * 0.2} width={b.w * 0.08} height={b.h * 0.6} fill="white" opacity="0.35" />
          </g>
        ))}
        {/* 우측 lane (살짝 뒤로 오프셋) */}
        {blocks.map((b, i) => (
          <g key={`r-${i}`} transform={`translate(${b.x + 80}, ${b.y + 32})`}>
            <rect x="0" y="0" width={b.w} height={b.h} rx={b.h * 0.15} />
            <rect x={b.w * 0.18} y={b.h * 0.2} width={b.w * 0.08} height={b.h * 0.6} fill="white" opacity="0.35" />
            <rect x={b.w * 0.46} y={b.h * 0.2} width={b.w * 0.08} height={b.h * 0.6} fill="white" opacity="0.35" />
            <rect x={b.w * 0.74} y={b.h * 0.2} width={b.w * 0.08} height={b.h * 0.6} fill="white" opacity="0.35" />
          </g>
        ))}
      </g>
    </svg>
  )
}

/**
 * 차량 두 줄 후기 — TodayPickHero / 배경 데코 용.
 * 8 block × 2 lane (차량 폭).
 */
export function IcoTireMarksDual(props: IconProps) {
  return (
    <svg width="200" height="56" viewBox="0 0 200 56" fill="none" {...props}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={`top-${i}`} x={i * 26} y="8" width="18" height="8" rx="2" fill="currentColor" />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={`bot-${i}`} x={i * 26} y="40" width="18" height="8" rx="2" fill="currentColor" />
      ))}
    </svg>
  )
}

export function IcoThumbsUp({ filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7 10v10H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 10 12 3a2 2 0 0 1 2 2v4h5.5a2 2 0 0 1 1.97 2.34l-1.4 8A2 2 0 0 1 18.1 21H7"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IcoThumbsDown({ filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M17 14V4h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M17 14 12 21a2 2 0 0 1-2-2v-4H4.5a2 2 0 0 1-1.97-2.34l1.4-8A2 2 0 0 1 5.9 3H17"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IcoFire(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 3s4 4 4 8a4 4 0 0 1-1.5 3.1c0-2-1-3.6-2.5-4.6 0 3-2 4-3 4.5a4 4 0 0 0 7 3.4A6 6 0 0 0 18 12c0-5-6-9-6-9Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function IcoSparkle(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.8 2.8M15.7 15.7l2.8 2.8M5.5 18.5l2.8-2.8M15.7 8.3l2.8-2.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IcoTrending(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="m3 17 6-6 4 4 8-9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 6h7v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IcoKakao(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" {...props}>
      <path
        d="M9 1C4.58 1 1 3.79 1 7.21C1 9.34 2.56 11.2 4.86 12.24L3.89 15.73C3.83 15.95 4.08 16.13 4.27 16L8.27 13.37C8.51 13.39 8.75 13.41 9 13.41C13.42 13.41 17 10.62 17 7.21C17 3.79 13.42 1 9 1Z"
        fill="#191919"
      />
    </svg>
  )
}

export function IcoNaver(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" {...props}>
      <path d="M13.56 10.7L6.15 0H0V20H6.44V9.3L13.85 20H20V0H13.56V10.7Z" fill="white" />
    </svg>
  )
}

export function IcoEmail(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="white" strokeWidth="1.5" />
      <path d="M2 7L12 13L22 7" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function IcoLogout(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4M16 17l5-5-5-5M21 12H9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IcoUser(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function IcoHome(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3.5 11 12 4l8.5 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 10v9a1 1 0 0 0 1 1H10v-5a2 2 0 0 1 4 0v5h3.5a1 1 0 0 0 1-1v-9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IcoWrite(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 20h4l10-10-4-4L4 16v4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m13.5 6.5 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
