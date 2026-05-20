'use client'

import Link from 'next/link'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <section className="flex h-dvh flex-col items-center justify-center px-6 text-center">
          <h1 className="mb-3 text-2xl font-bold text-[#171717]">일시적인 오류가 발생했어요</h1>
          <p className="mb-10 max-w-md text-sm leading-relaxed text-[#525252]">
            잠시 후 다시 시도해주세요. 문제가 계속되면 페이지를 새로고침 해주세요.
          </p>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
            >
              다시 시도하기
            </button>
            <Link href="/" className="text-sm font-medium text-[#525252] transition-colors hover:text-[#171717]">
              Trace 홈으로 →
            </Link>
          </div>
        </section>
      </body>
    </html>
  )
}
