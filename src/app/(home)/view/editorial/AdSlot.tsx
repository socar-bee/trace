/**
 * Hero 우측 광고 placeholder — 모주 본진 쿠폰 톤 SVG mockup.
 * dashed 외곽 + MODU·COUPON 헤더 + 거대한 30% + 쿠폰 코드 박스 + 유효기간.
 */
export default function AdSlot() {
  return (
    <aside
      className="hidden flex-col items-center justify-center gap-3 py-8 text-center md:flex"
      aria-label="광고 영역"
    >
      <svg
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
        className="aspect-square w-full max-w-[320px]"
        role="img"
        aria-label="모주 본진 30% 할인 쿠폰 광고"
      >
        {/* Background */}
        <rect width="300" height="300" fill="var(--color-brand-50)" />

        {/* Decorative diagonal stripe (subtle) */}
        <g opacity="0.12">
          <rect x="220" y="-30" width="100" height="380" transform="rotate(20 270 0)" fill="var(--color-brand-500)" />
        </g>

        {/* Coupon dashed outer border */}
        <rect
          x="14"
          y="14"
          width="272"
          height="272"
          fill="none"
          stroke="var(--color-brand-700)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          rx="2"
        />

        {/* Corner dots */}
        <g fill="var(--color-brand-700)">
          <circle cx="22" cy="22" r="1.5" />
          <circle cx="278" cy="22" r="1.5" />
          <circle cx="22" cy="278" r="1.5" />
          <circle cx="278" cy="278" r="1.5" />
        </g>

        {/* Header — MODU·COUPON + NO */}
        <text
          x="32"
          y="44"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="var(--color-fg)"
          fontWeight="700"
          letterSpacing="2.5"
        >
          MODU·COUPON
        </text>
        <text
          x="268"
          y="44"
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize="9"
          fill="var(--color-fg-3)"
          letterSpacing="1.5"
        >
          NO.0421
        </text>

        {/* Hairline divider */}
        <line x1="32" y1="58" x2="268" y2="58" stroke="var(--color-line-2)" strokeWidth="1" />

        {/* 큰 30% — 강조 (단일 text 가운데 정렬) */}
        <text
          x="150"
          y="175"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontWeight="900"
          fontSize="86"
          fill="var(--color-brand-700)"
          letterSpacing="-3"
        >
          30%
        </text>

        {/* Sub */}
        <text
          x="150"
          y="200"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontWeight="700"
          fontSize="15"
          fill="var(--color-fg)"
          letterSpacing="-0.3"
        >
          주차 요금 할인
        </text>

        {/* dashed divider */}
        <line x1="48" y1="220" x2="252" y2="220" stroke="var(--color-fg-3)" strokeDasharray="2 3" strokeWidth="1" />

        {/* 쿠폰 코드 박스 */}
        <rect x="85" y="232" width="130" height="22" fill="var(--color-bg)" stroke="var(--color-fg)" strokeWidth="1" />
        <text
          x="150"
          y="248"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="11"
          fontWeight="700"
          fill="var(--color-fg)"
          letterSpacing="2.5"
        >
          MODU30NEW
        </text>

        {/* 유효기간 */}
        <text
          x="150"
          y="276"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="var(--color-fg-3)"
          letterSpacing="1"
        >
          ~ 2026.06.30 사용가능
        </text>
      </svg>

      <p className="text-fg-4 font-mono text-[10px] tracking-[0.18em] uppercase">— ad —</p>
    </aside>
  )
}
