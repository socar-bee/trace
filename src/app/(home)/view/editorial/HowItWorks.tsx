const STEPS = [
  {
    n: '01',
    t: '결제 + 사용',
    d: '모주 앱으로 주차장을 결제하고, 실제로 주차권을 사용해요. 결제만 한 사람은 못 써요.'
  },
  {
    n: '02',
    t: '영수증 CTA',
    d: '사용 완료 후 영수증 화면에서 "후기 남기기". 차량번호는 해시되어 영영 노출되지 않아요.'
  },
  {
    n: '03',
    t: '익명 게시',
    d: '{색상}{동물}{4자리}로 자동 생성된 닉네임. 같은 차로 또 써도 같은 닉네임이 평생 유지돼요.'
  }
] as const

export default function HowItWorks() {
  return (
    <section className="border-line border-b">
      <div className="mx-auto max-w-[1200px] px-6 py-11">
        <header className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-fg flex items-center gap-2.5 font-mono text-[13px] font-semibold tracking-[0.02em] uppercase">
            <span className="text-accent">§</span>작동 방식
          </h2>
          <span className="text-fg-3 font-mono text-[11px]">3단계</span>
        </header>
        <div className="border-line grid grid-cols-1 border-t md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className={`py-6 ${i > 0 ? 'md:pl-6' : ''} ${i < 2 ? 'md:border-line md:border-r md:pr-6' : ''}`}
            >
              <div className="text-accent mb-3.5 font-mono text-[11px]">{s.n}</div>
              <div className="text-fg mb-2 text-[18px] font-semibold tracking-[-0.015em]">{s.t}</div>
              <div className="text-fg-2 text-[13px] leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
