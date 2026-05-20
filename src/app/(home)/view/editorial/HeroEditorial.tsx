interface HeroEditorialProps {
  totalReviews: number
  totalLots: number
  verifiedRate: number
}

function fmt(n: number) {
  return n.toLocaleString('ko-KR')
}

export default function HeroEditorial({ totalReviews, totalLots, verifiedRate }: HeroEditorialProps) {
  return (
    <section className="border-line border-b">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
        <div className="text-fg-3 mb-6 flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase">
          <span className="bg-fg-3 inline-block h-px w-4" />
          trace.modu.kr
        </div>
        <h1 className="text-fg m-0 mb-5 text-[clamp(36px,6vw,60px)] leading-[1.05] font-bold tracking-[-0.03em] text-balance">
          다녀온 사람만 쓰는
          <br />
          <em className="text-accent not-italic">주차장 후기</em>
        </h1>
        <p className="text-fg-2 m-0 mb-9 max-w-[540px] text-[17px] leading-relaxed">
          주차권을 실제로 사용한 운전자만 글을 남길 수 있어요. 닉네임은 자동으로 만들어지고, 차량번호는 저장되지
          않습니다.
        </p>
        <ul className="text-fg-3 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px]">
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
      </div>
    </section>
  )
}
