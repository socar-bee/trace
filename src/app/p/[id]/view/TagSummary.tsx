import TagPill from '@/shared/components/ui/Tag'

import type { ParkingLotTagSummary } from '@/shared/types/trace'

interface TagSummaryProps {
  topTags: ParkingLotTagSummary[]
}

export default function TagSummary({ topTags }: TagSummaryProps) {
  if (topTags.length === 0) {
    return <p className="text-text-soft text-sm">아직 태그가 없어요. 첫 흔적을 남기면 여기에 표시돼요.</p>
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {topTags.map((t) => (
        <TagPill key={t.tag} tag={t.tag} count={t.count} />
      ))}
    </div>
  )
}
