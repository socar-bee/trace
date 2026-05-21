'use client'

import { VERIFY_SOURCES } from '../model'
import { useVerifyViewModel } from '../viewmodel'

interface VerifyViewProps {
  onboard?: boolean
}

export default function VerifyView({ onboard = false }: VerifyViewProps) {
  const vm = useVerifyViewModel()

  // 비로그인 시 redirect 진행 중 — 빈 화면 표시 (깜빡임 방지)
  if (!vm.canRender) {
    return (
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[540px] px-6 py-12">
          <p className="text-fg-3 text-center font-mono text-xs tracking-wider uppercase">verifying session…</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[540px] px-6 py-12 md:py-16">
        <header className="mb-8 text-center">
          <p className="text-accent mb-4 font-mono text-[11px] font-bold tracking-[0.06em] uppercase">
            {onboard ? '회원가입 완료 · 검증 단계' : '검증 마크 받기'}
          </p>
          <h1 className="text-fg text-3xl font-extrabold tracking-[-0.025em] md:text-[32px]">
            이용내역으로
            <br />
            검증해주세요
          </h1>
          <p className="text-fg-2 mt-3 text-sm leading-relaxed">
            주차 영수증이나 이용내역을 첨부하면 <b className="text-fg font-bold">AI가 자동으로 확인</b>해드려요. 어디서
            사용했는지는 다른 사람에게 표시되지 않아요.
          </p>
        </header>

        {vm.stage === 'pick' && (
          <>
            <div className="mb-7 flex flex-col gap-2.5">
              {VERIFY_SOURCES.map((s) =>
                s.id === 'upload' ? (
                  <label
                    key={s.id}
                    className="border-fg bg-bg flex w-full cursor-pointer items-center gap-3.5 border p-4 text-left transition-transform hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <SourceIcon bg={s.bg} fg={s.fg} icon={s.icon} />
                    <SourceBody name={s.name} desc={s.desc} />
                    <span className="text-fg-3 shrink-0 font-mono text-lg">→</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      hidden
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) vm.pickFile(f)
                      }}
                    />
                  </label>
                ) : (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => vm.pickSource(s)}
                    className="border-fg bg-bg group flex w-full items-center gap-3.5 border p-4 text-left transition-transform hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <SourceIcon bg={s.bg} fg={s.fg} icon={s.icon} />
                    <SourceBody name={s.name} desc={s.desc} />
                    <span className="text-fg-3 group-hover:text-accent shrink-0 font-mono text-lg transition-colors">
                      →
                    </span>
                  </button>
                )
              )}
            </div>

            <aside className="border-line-2 bg-bg-2 border border-dashed p-4">
              <p className="text-fg mb-1.5 text-sm font-bold">🔒 개인정보 보호</p>
              <p className="text-fg-2 text-xs leading-relaxed">
                업로드된 영수증·이용내역은 <b className="text-fg font-bold">본인 인증 용도로만 사용</b>되며, 검증 즉시
                삭제됩니다. 후기에는 &ldquo;검증되었음&rdquo; 마크만 표시되고 어떤 서비스를 이용했는지는 다른 사람에게
                노출되지 않아요.
              </p>
            </aside>
          </>
        )}

        {vm.stage !== 'pick' && vm.file && (
          <div className="flex flex-col gap-5">
            <div className="border-fg bg-bg flex items-center gap-3 border p-3.5">
              <span className="text-lg">📎</span>
              <div className="min-w-0 flex-1">
                <p className="text-fg truncate text-sm font-bold">{vm.file.name}</p>
                <p className="text-fg-3 font-mono text-[11px]">
                  {vm.file.size} · {vm.file.source}
                </p>
              </div>
              {vm.stage === 'uploaded' && (
                <button
                  type="button"
                  onClick={vm.reset}
                  className="border-fg text-fg hover:bg-bg-2 shrink-0 border bg-white px-3 py-2 text-xs font-bold"
                >
                  변경
                </button>
              )}
            </div>

            {vm.stage === 'uploaded' && (
              <button
                type="button"
                onClick={() => void vm.runScan()}
                className="bg-accent text-static-white w-full px-5 py-3.5 text-sm font-bold tracking-tight transition-transform hover:-translate-y-px"
                style={{ boxShadow: '3px 3px 0 var(--color-fg)' }}
              >
                AI 검증 시작하기
              </button>
            )}

            {vm.stage === 'scanning' && (
              <div className="border-line-2 bg-bg-2 flex flex-col items-center gap-6 border p-10">
                <span
                  className="border-line-2 border-t-accent inline-block size-12 animate-spin rounded-full border-4"
                  aria-hidden
                />
                <div className="flex flex-col gap-2 font-mono text-xs">
                  <p className="text-accent-700">✓ 영수증 인식</p>
                  <p className="text-fg font-bold">⏵ 주차장·이용시간 추출 중…</p>
                  <p className="text-fg-3">○ 본인 명의 확인</p>
                  <p className="text-fg-3">○ 검증 마크 발급</p>
                </div>
              </div>
            )}

            {vm.stage === 'done' && vm.extracted && (
              <div className="flex flex-col items-center gap-3.5 pt-6 text-center">
                <span className="border-accent-500 bg-accent-50 text-accent-700 mb-1.5 inline-flex size-[72px] items-center justify-center border-[3px]">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3 12l6 6L21 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h2 className="text-fg m-0 text-[26px] font-extrabold tracking-[-0.02em]">검증 완료!</h2>
                <p className="text-fg-2 m-0 text-sm leading-relaxed">
                  이제 후기를 작성할 수 있어요.
                  <br />이 주차장에 대한 후기를 남겨주세요.
                </p>

                <div className="border-fg bg-bg my-3 w-full border border-dashed p-4 text-left">
                  <p className="text-fg-3 mb-2.5 font-mono text-[10px] tracking-[0.06em] uppercase">
                    AI가 인식한 이용내역
                  </p>
                  <ExtractRow label="주차장" value={vm.extracted.parkingLotName} />
                  <ExtractRow label="날짜" value={vm.extracted.date} />
                  <ExtractRow
                    label="이용시간"
                    value={`${vm.extracted.enterAt} → ${vm.extracted.exitAt} (${vm.extracted.duration})`}
                  />
                  <ExtractRow label="결제금액" value={vm.extracted.amount} />
                </div>

                <button
                  type="button"
                  onClick={vm.finish}
                  className="bg-accent text-static-white w-full px-5 py-3.5 text-sm font-bold tracking-tight transition-transform hover:-translate-y-px"
                  style={{ boxShadow: '3px 3px 0 var(--color-fg)' }}
                >
                  이 주차장 후기 쓰러가기 →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

function SourceIcon({ bg, fg, icon }: { bg: string; fg?: string; icon: string }) {
  return (
    <span
      className="inline-flex size-9 shrink-0 items-center justify-center text-base font-extrabold"
      style={{ background: bg, color: fg ?? '#fff' }}
    >
      {icon}
    </span>
  )
}

function SourceBody({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <b className="text-fg text-sm font-bold">{name}</b>
      <span className="text-fg-3 text-xs">{desc}</span>
    </div>
  )
}

function ExtractRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 py-0.5 text-xs">
      <span className="text-fg shrink-0 font-mono tracking-wide uppercase">{label}</span>
      <span className="border-line-2 flex-1 self-end border-b border-dotted" aria-hidden />
      <span className="text-fg font-mono tabular-nums">{value}</span>
    </div>
  )
}
