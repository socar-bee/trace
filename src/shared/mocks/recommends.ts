import type { RecommendStats } from '@/shared/types/trace'

function seedHash(seed: string): number {
  let s = 2166136261
  for (let i = 0; i < seed.length; i++) {
    s = Math.imul(s ^ seed.charCodeAt(i), 16777619) >>> 0
  }
  return s >>> 0
}

/**
 * 주차장별 baseline 추천/비추천 카운트 (결정론적).
 * 사용자가 localStorage 로 누른 vote 가 클라이언트에서 +1 으로 합쳐진다.
 */
export function getRecommendStats(seq: string): RecommendStats {
  const h = seedHash(`recommend:${seq}`)
  const total = 60 + (h % 180)
  const upRatio = 0.55 + ((h >> 8) % 35) / 100
  const upCount = Math.round(total * upRatio)
  return {
    upCount,
    downCount: total - upCount
  }
}
