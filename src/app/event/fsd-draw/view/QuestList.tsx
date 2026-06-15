import Link from 'next/link'

import type { QuestItemVM } from '../viewmodel'

interface QuestListProps {
  quests: QuestItemVM[]
  active: boolean
  inviteCopied: boolean
  onCopyInvite: () => void
  onSimulateInvite: () => void
}

function questStatusLabel(q: QuestItemVM): string | null {
  if (q.done) return '완료'
  if (q.cappedToday) return '오늘 한도 도달'
  return null
}

export default function QuestList({ quests, active, inviteCopied, onCopyInvite, onSimulateInvite }: QuestListProps) {
  return (
    <ul className="border-line divide-line divide-y border-[1.5px]">
      {quests.map((q) => {
        const statusLabel = questStatusLabel(q)
        const disabled = !active || q.done || q.cappedToday
        return (
          <li key={q.def.id} className="bg-bg flex items-center gap-3 px-4 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-fg flex items-baseline gap-2 text-sm font-bold">
                {q.def.title}
                <span className="text-brand-500 font-mono text-[11px]">+{q.def.tickets}장</span>
                {q.def.cap.kind === 'total' && (
                  <span className="text-fg-3 font-mono text-[10px]">
                    {q.earnCount}/{q.def.cap.limit}
                  </span>
                )}
              </p>
              <p className="text-fg-3 mt-0.5 text-xs">{q.def.description}</p>
            </div>
            {statusLabel ? (
              <span className="text-fg-3 shrink-0 font-mono text-[11px]">{statusLabel}</span>
            ) : q.def.id === 'invite' ? (
              <span className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={onCopyInvite}
                  disabled={!active}
                  className="border-line-2 hover:border-fg text-fg border-[1.5px] px-2.5 py-1.5 font-mono text-[11px] transition-colors disabled:opacity-40"
                >
                  {inviteCopied ? '복사됨' : '링크 복사'}
                </button>
                <button
                  type="button"
                  onClick={onSimulateInvite}
                  disabled={!active}
                  className="border-line-2 text-fg-3 hover:text-fg border-[1.5px] border-dashed px-2.5 py-1.5 font-mono text-[10px] transition-colors disabled:opacity-40"
                >
                  가입 완료(데모)
                </button>
              </span>
            ) : q.def.cta ? (
              <Link
                href={q.def.cta.href}
                aria-disabled={disabled}
                className={`border-[1.5px] px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                  disabled
                    ? 'border-line text-fg-3 pointer-events-none opacity-40'
                    : 'border-line-2 hover:border-fg text-fg'
                }`}
              >
                {q.def.cta.label}
              </Link>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
