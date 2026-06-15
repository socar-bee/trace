import Image from 'next/image'

interface Prize {
  rank: string
  badge: string
  name: string
  sub: string
  count: string
  img: string
  /** cover: 사진이 원을 꽉 채움 / contain: 로고를 가운데 여백 두고 */
  fit: 'cover' | 'contain'
  circle: string
}

const PRIZES: Prize[] = [
  {
    rank: '1등',
    badge: 'bg-brand-600 text-static-white',
    name: '테슬라 모델X(FSD)',
    sub: '1개월 사용권',
    count: '단 2명',
    img: '/event/tesla-modelx.jpg',
    fit: 'cover',
    circle: 'bg-bg-2'
  },
  {
    rank: '2등',
    badge: 'bg-yellow-500 text-fg',
    name: '기프티콘 5천원권',
    sub: '모바일 쿠폰',
    count: '300명',
    img: '/event/gift.svg',
    fit: 'cover',
    circle: 'bg-yellow-100'
  },
  {
    rank: '전원',
    badge: 'bg-accent-600 text-static-white',
    name: '주차 할인 쿠폰',
    sub: '최초 응모 시 1회',
    count: '참여자 전원',
    img: '/icons/icn_modu.svg',
    fit: 'contain',
    circle: 'bg-bg'
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

      <ul className="mt-5 grid grid-cols-3 gap-3">
        {PRIZES.map((p, i) => (
          <li
            key={p.rank}
            className="evt-rise flex flex-col items-center text-center"
            style={{ animationDelay: `${0.06 + i * 0.09}s` }}
          >
            <div className="relative">
              <div
                className={`border-line-2 relative size-[88px] overflow-hidden rounded-full border-[1.5px] sm:size-[104px] ${p.circle}`}
              >
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  sizes="104px"
                  className={p.fit === 'contain' ? 'object-contain p-5' : 'object-cover object-center'}
                />
              </div>
              <span
                className={`absolute -top-1 -left-1 flex size-8 items-center justify-center rounded-full font-mono text-[11px] font-bold shadow-sm ${p.badge}`}
              >
                {p.rank}
              </span>
            </div>
            <p className="text-fg mt-3 text-[13px] leading-tight font-bold">{p.name}</p>
            <p className="text-fg-3 mt-0.5 text-[11px]">{p.sub}</p>
            <p className="text-brand-600 mt-1 font-mono text-[11px] font-bold">{p.count}</p>
          </li>
        ))}
      </ul>

      <div className="border-line mt-6 border-t border-dashed pt-4 text-center">
        <p className="text-fg text-sm font-bold">참여하신 분들 중 추첨을 통해 경품을 드려요</p>
        <p className="text-fg-3 mt-1.5 inline-flex items-center gap-1.5 text-xs">
          <span className="bg-accent-500 size-1.5 rounded-full" aria-hidden />
          응모권이 많을수록 당첨 확률이 올라가요 · 가중 추첨
        </p>
      </div>
    </section>
  )
}
