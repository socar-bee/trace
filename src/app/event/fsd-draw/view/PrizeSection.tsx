interface Prize {
  tier: 'grand' | 'second' | 'all'
  index: string
  badge: string
  count: string
  name: string
  desc: string
  value?: string
}

const PRIZES: Prize[] = [
  {
    tier: 'grand',
    index: '01',
    badge: 'GRAND PRIZE',
    count: '단 2명',
    name: '테슬라 모델X(FSD) 1개월 사용권',
    desc: '쏘카 FSD 구독 제공',
    value: '시가 310만원 상당'
  },
  {
    tier: 'second',
    index: '02',
    badge: '2ND',
    count: '300명',
    name: '기프티콘 5천원권',
    desc: '모바일 쿠폰 발송'
  },
  {
    tier: 'all',
    index: 'ALL',
    badge: '전원 증정',
    count: '참여자 전원',
    name: '주차 할인 쿠폰',
    desc: '최초 응모 시 1회 지급 · 중복 불가'
  }
]

export default function PrizeSection() {
  return (
    <section className="mt-7">
      <div className="flex items-center gap-3">
        <h2 className="text-fg-3 font-mono text-xs tracking-[0.25em]">PRIZES</h2>
        <span className="bg-line-2 h-px flex-1" aria-hidden />
        <span className="text-fg-3 font-mono text-[10px] tracking-[0.2em]">경품 안내</span>
      </div>

      <ul className="mt-3.5 space-y-2.5">
        {PRIZES.map((p, i) => {
          const delay = { animationDelay: `${0.06 + i * 0.09}s` }

          if (p.tier === 'grand') {
            return (
              <li
                key={p.tier}
                className="evt-rise border-fg bg-fg text-static-white relative overflow-hidden border-[1.5px] px-5 py-5 transition-transform hover:-translate-y-0.5"
                style={{ ...delay, boxShadow: '3px 3px 0 var(--color-brand-500)' }}
              >
                {/* 상단 블루 글로우 + 거대 인덱스 워터마크 (간지) */}
                <span
                  className="from-brand-500/20 pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b to-transparent"
                  aria-hidden
                />
                <span className="text-static-white/[0.05] pointer-events-none absolute -right-3 -bottom-7 font-mono text-[130px] leading-none font-extrabold select-none">
                  {p.index}
                </span>

                <div className="relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="bg-brand-500 text-static-white inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.18em]">
                      {p.badge}
                    </span>
                    <span className="text-static-white/55 font-mono text-[11px]">· {p.count}</span>
                  </div>
                  <p className="mt-3 text-[19px] leading-[1.3] font-extrabold tracking-[-0.01em]">{p.name}</p>
                  <p className="text-static-white/50 mt-1.5 text-xs">{p.desc}</p>
                  {p.value && (
                    <span className="border-brand-400/50 bg-brand-500/15 mt-3.5 inline-flex items-center gap-1.5 border px-2.5 py-1">
                      <span className="bg-brand-400 size-1 rounded-full" aria-hidden />
                      <span className="text-brand-200 font-mono text-[11px] font-bold tracking-wide">{p.value}</span>
                    </span>
                  )}
                </div>
              </li>
            )
          }

          const isAll = p.tier === 'all'
          return (
            <li
              key={p.tier}
              className={`evt-rise border-line-2 bg-bg relative overflow-hidden border-[1.5px] px-5 py-4 ${
                isAll ? 'border-dashed' : ''
              }`}
              style={delay}
            >
              <span className="text-fg/[0.04] pointer-events-none absolute -right-2 -bottom-5 font-mono text-[88px] leading-none font-extrabold select-none">
                {p.index}
              </span>
              <div className="relative z-10">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.16em] ${
                      isAll ? 'bg-accent-600 text-static-white' : 'text-fg bg-yellow-500'
                    }`}
                  >
                    {p.badge}
                  </span>
                  <span className="text-fg-3 font-mono text-[11px]">· {p.count}</span>
                </div>
                <p className="text-fg mt-2.5 text-[16px] font-bold">{p.name}</p>
                <p className="text-fg-3 mt-0.5 text-xs">{p.desc}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
