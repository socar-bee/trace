import { getTag } from '@/shared/lib/tags'

import type { TagDef, TagKey } from '@/shared/types/trace'

interface TagPillProps {
  tag: TagKey | TagDef
  count?: number
  className?: string
}

export default function TagPill({ tag, count, className = '' }: TagPillProps) {
  const def = typeof tag === 'string' ? getTag(tag) : tag
  const tone =
    def.sentiment === 'positive'
      ? 'bg-accent-50 text-accent-700 ring-accent-100'
      : def.sentiment === 'negative'
        ? 'bg-negative-50 text-negative-700 ring-negative-100'
        : 'bg-bg-soft text-text-sub ring-stroke-soft'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${tone} ${className}`}
    >
      <span>{def.label}</span>
      {typeof count === 'number' && <span className="font-semibold tabular-nums">{count}</span>}
    </span>
  )
}
