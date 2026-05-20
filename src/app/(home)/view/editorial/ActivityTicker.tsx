import type { LiveActivity } from '@/shared/mocks/api'

interface ActivityTickerProps {
  activities: LiveActivity[]
}

export default function ActivityTicker({ activities }: ActivityTickerProps) {
  const doubled = [...activities, ...activities]
  return (
    <div className="bg-bg-2 border-line overflow-hidden border-y">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-fg-3 flex items-center gap-[18px] py-2.5 font-mono text-[11px]">
          <span className="text-fg border-line-2 inline-flex shrink-0 items-center gap-1.5 border-r pr-3.5">
            <span className="size-1.5 animate-[pulse-dot_1.5s_ease-in-out_infinite] rounded-full bg-[var(--color-negative-500)]" />
            LIVE
          </span>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex w-max gap-8 whitespace-nowrap motion-safe:animate-[ticker-scroll_60s_linear_infinite]">
              {doubled.map((a, i) => (
                <span key={i}>
                  <b className="text-fg font-medium">{a.nickname}</b> →{' '}
                  <em className="text-accent not-italic">{a.parkingLotName}</em> · ★{a.rating}.0
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
