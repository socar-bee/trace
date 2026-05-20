import type { TagDef, TagKey } from '@/shared/types/trace'

export const TAGS: readonly TagDef[] = [
  { key: 'guide-good', label: '안내좋음', sentiment: 'positive' },
  { key: 'cheap', label: '저렴', sentiment: 'positive' },
  { key: 'narrow', label: '좁음', sentiment: 'negative' },
  { key: 'slow-gate', label: '게이트느림', sentiment: 'negative' },
  { key: 'often-full', label: '만차자주', sentiment: 'negative' }
] as const

const TAG_MAP: Record<TagKey, TagDef> = TAGS.reduce(
  (acc, t) => {
    acc[t.key] = t
    return acc
  },
  {} as Record<TagKey, TagDef>
)

export function getTag(key: TagKey): TagDef {
  return TAG_MAP[key]
}

export function getTagLabel(key: TagKey): string {
  return TAG_MAP[key]?.label ?? key
}
