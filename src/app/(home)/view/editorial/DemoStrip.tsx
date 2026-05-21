import Link from 'next/link'

export default function DemoStrip() {
  return (
    <div className="bg-fg text-bg font-mono text-[11px]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-stretch justify-between gap-1 px-6 py-2 text-center whitespace-normal sm:flex-row sm:items-center sm:gap-4 sm:text-left sm:whitespace-nowrap">
        <span className="max-sm:text-[10px] max-sm:opacity-70">
          <b className="text-accent mr-1.5 font-medium">DEMO</b>모주 본진 앱 영수증 CTA 시뮬레이션
        </span>
        <Link
          href="/write?token=demo-1024"
          className="hover:border-accent hover:text-accent border-b border-dashed border-neutral-600 pb-px transition-colors"
        >
          주차권 사용 완료 → 후기 남기기 →
        </Link>
      </div>
    </div>
  )
}
