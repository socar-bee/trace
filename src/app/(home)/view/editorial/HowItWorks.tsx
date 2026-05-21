import Image from 'next/image'

const STEPS = [
  {
    n: '01',
    t: '로그인 + 검증',
    d: '카카오·네이버·이메일로 가입한 뒤 영수증·이용내역을 첨부하면 AI가 자동으로 확인해드려요.'
  },
  {
    n: '02',
    t: '익명 닉네임 발급',
    d: '{색상}{동물}{4자리}로 자동 생성. 차량번호는 SHA256 해시되어 저장되고, 같은 차로 또 써도 닉네임이 영구 고정돼요.'
  },
  {
    n: '03',
    t: '영수증 후기 작성',
    d: '별점·태그·자유 코멘트로 한 장의 영수증 후기를 남겨요. 게시 후 24시간 내 수정·삭제 가능.'
  }
] as const

export default function HowItWorks() {
  return (
    <section className="border-line border-b">
      <div className="mx-auto max-w-[1200px] px-6 py-11">
        <header className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-fg flex items-center gap-2 font-mono text-[13px] font-semibold tracking-[0.02em] uppercase">
            <Image src="/icons/icn_review.webp" alt="" width={20} height={20} aria-hidden className="shrink-0" />
            이용 방법
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
