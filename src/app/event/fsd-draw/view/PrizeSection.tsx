const PRIZES = [
  {
    grade: '1등 · 2명',
    name: '테슬라 모델X(FSD) 1개월 사용권',
    desc: '쏘카 FSD 구독 제공 · 시가 310만원 상당',
    highlight: true
  },
  { grade: '2등 · 300명', name: '기프티콘 5천원권', desc: '모바일 쿠폰 발송', highlight: false },
  { grade: '전원', name: '주차 할인 쿠폰', desc: '최초 응모 시 1회 지급 (중복 불가)', highlight: false }
]

export default function PrizeSection() {
  return (
    <section className="mt-6">
      <h2 className="text-fg-3 font-mono text-xs tracking-[0.25em]">PRIZES — 경품 안내</h2>
      <ul className="mt-3 space-y-2.5">
        {PRIZES.map((p) => (
          <li
            key={p.grade}
            className={`border-[1.5px] px-4 py-3.5 ${p.highlight ? 'border-fg bg-bg' : 'border-line bg-bg'}`}
            style={p.highlight ? { boxShadow: '2px 2px 0 var(--color-fg)' } : undefined}
          >
            <p className={`font-mono text-[11px] font-bold ${p.highlight ? 'text-accent-500' : 'text-fg-3'}`}>
              {p.grade}
            </p>
            <p className="text-fg mt-1 text-[15px] font-bold">{p.name}</p>
            <p className="text-fg-3 mt-0.5 text-xs">{p.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
