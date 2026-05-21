import AdSlot from './AdSlot'
import AnimatedHeading from './AnimatedHeading'

const HERO_TEXT = '반갑습니다'

interface HeroEditorialProps {
  /** compact 모드: 통계 strip 숨김 + padding 축소 */
  compact?: boolean
  totalReviews?: number
  totalLots?: number
  verifiedRate?: number
}

function fmt(n: number) {
  return n.toLocaleString('ko-KR')
}

/**
 * 발급 시각을 영수증 톤 'YYYY.MM.DD HH:mm' (KST) 으로 포맷.
 * server component에서 평가되며 페이지 revalidate(10분) 주기로 갱신된다.
 */
function formatReceiptDate(): string {
  const formatted = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date())
  return formatted.replace(', ', ' ').replace(/-/g, '.')
}

/** d-day 기준 영수증 번호 — 서비스 런칭일(2026-01-01)로부터 일자 4자리 */
function makeReceiptNo(): string {
  const launch = new Date('2026-01-01T00:00:00+09:00').getTime()
  const days = Math.max(1, Math.floor((Date.now() - launch) / 86400000) + 1)
  return `#${String(days).padStart(4, '0')}`
}

/**
 * Home hero — 영수증 절취선 메타포 (좌측 정렬).
 * Trace H1 + Date/No/Rating/Desc receipt rows. Rating row의 별이 채워졌다가 사라지는 loop 애니메이션.
 */
export default function HeroEditorial({ compact = false, totalReviews, totalLots, verifiedRate }: HeroEditorialProps) {
  const dateStr = formatReceiptDate()
  const noStr = makeReceiptNo()

  return (
    <section className="border-line border-b">
      <div className={`mx-auto max-w-[1200px] px-6 ${compact ? 'py-10 md:py-14' : 'py-14 md:py-20'}`}>
        <div className="grid md:grid-cols-[1fr_minmax(260px,320px)]">
          {/* 좌측 영수증 */}
          <div className="min-w-0 md:pr-10">
            {/* RECEIPT label */}
            <p className="text-fg-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase">
              <span className="bg-fg-3 inline-block h-px w-6" />
              REVIEW
            </p>

            {/* Top perforation */}
            <div className="border-fg mt-4 border-t border-dashed" />

            {/* H1 — Trace brand (3 phrase 순환) */}
            <h1 className="text-fg mt-6 mb-5 text-[clamp(28px,5vw,48px)] leading-none font-extrabold tracking-[-0.02em]">
              <AnimatedHeading text={HERO_TEXT} />
            </h1>

            {/* Line items (영수증 row 패턴) */}
            <dl className="mb-6 max-w-[420px] space-y-1 font-mono text-xs">
              <ReceiptRow label="날짜" value={dateStr} />
              <ReceiptRow label="번호" value={noStr} accent />
              <ReceiptRowStars label="별점" />
              <ReceiptRow label="분류" value="운전자들의 진짜 후기" />
            </dl>

            {/* Bottom perforation */}
            <div className="border-fg border-b border-dashed" />

            {/* Lede + verified */}
            <div className="mt-6 flex flex-col gap-3">
              <p className="text-fg-2 m-0 text-[17px] leading-relaxed">
                검증된 회원만 작성하는 후기, 추천·투표는 누구나.
              </p>
              <p className="text-accent-700 font-mono text-[11px] tracking-[0.06em] uppercase">
                <span className="bg-accent-500 mr-2 inline-block size-1.5 rounded-full align-middle" />
                verified · 영수증 기반 익명 후기
              </p>
            </div>

            {!compact && totalReviews != null && totalLots != null && verifiedRate != null && (
              <ul className="text-fg-3 mt-9 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px]">
                <li>
                  <b className="text-fg mr-1.5 font-medium">{fmt(totalReviews)}</b>누적 후기
                </li>
                <li>
                  <b className="text-fg mr-1.5 font-medium">{fmt(totalLots)}</b>등록 주차장
                </li>
                <li>
                  <b className="text-fg mr-1.5 font-medium">{verifiedRate}%</b>검증율
                </li>
                <li>
                  <b className="text-fg mr-1.5 font-medium">v0.0.1</b>
                </li>
              </ul>
            )}
          </div>

          {/* 우측 광고 — md+ 노출 */}
          <div className="md:pl-10">
            <AdSlot />
          </div>
        </div>
      </div>
    </section>
  )
}

function ReceiptRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-fg-3 w-12 shrink-0">{label}</dt>
      <span className="border-line-2 mb-1 flex-1 self-end border-b border-dotted" aria-hidden />
      <dd className={`tabular-nums ${accent ? 'text-accent' : 'text-fg'}`}>{value}</dd>
    </div>
  )
}

function ReceiptRowStars({ label }: { label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="text-fg-3 w-12 shrink-0">{label}</dt>
      <span className="border-line-2 mb-1 flex-1 self-end border-b border-dotted" aria-hidden />
      <dd className="leading-none">
        <span className="relative inline-block" aria-label="별점 채워지는 애니메이션">
          <span className="text-fg-4">★★★★★</span>
          <span
            className="text-caution-500 absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap"
            style={{ animation: 'star-fill 3s ease-in-out infinite' }}
            aria-hidden
          >
            ★★★★★
          </span>
        </span>
      </dd>
    </div>
  )
}
