import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-text-soft mb-2 text-sm font-medium tracking-wider uppercase">404</p>
      <h1 className="text-text-strong mb-3 text-2xl font-bold md:text-3xl">페이지를 찾을 수 없습니다</h1>
      <p className="text-text-sub mb-10 max-w-md text-sm leading-relaxed">
        요청하신 페이지가 존재하지 않거나, 주소가 변경되었을 수 있어요.
      </p>
      <Link
        href="/"
        className="bg-brand-500 hover:bg-brand-700 active:bg-brand-900 text-static-white inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-colors"
      >
        Trace 홈으로
      </Link>
    </section>
  )
}
