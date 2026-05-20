import { generateNickname } from '@/shared/lib/nickname'

import type { Review, TagKey } from '@/shared/types/trace'

const TAG_POOL: TagKey[] = ['guide-good', 'cheap', 'narrow', 'slow-gate', 'often-full']

const SAMPLE_COMMENTS = [
  '가격은 합리적이고 입출차 동선도 편했어요.',
  '주말 점심시간에 만차였는데 빠르게 자리가 났어요.',
  '입구가 좁아서 큰 차는 조심해야 합니다.',
  '게이트에서 결제 인식이 느려서 살짝 답답했어요.',
  '안내 직원분이 친절하셔서 처음 가도 헷갈리지 않았어요.',
  '근처 식당 다녀오기 좋고 가격도 적당합니다.',
  '주변에 비해 시간당 요금이 저렴한 편이에요.',
  '엘리베이터 위치가 멀어서 짐 많을 땐 불편합니다.',
  '주차 공간이 표시되어 있어서 자리 찾기 쉬워요.',
  '평일 저녁은 한산해서 들어가기 좋아요.',
  '주말 점심에 만차가 많아서 대기 줄 섰어요.',
  '입차 게이트 인식이 빨라서 좋았습니다.',
  '경사로가 가파른 편이라 출차할 때 조심하세요.',
  null,
  null
]

function pseudoRandom(seed: string): () => number {
  let s = 2166136261
  for (let i = 0; i < seed.length; i++) {
    s = Math.imul(s ^ seed.charCodeAt(i), 16777619) >>> 0
  }
  return () => {
    s = Math.imul(s ^ (s >>> 15), 2246822507) >>> 0
    s = Math.imul(s ^ (s >>> 13), 3266489909) >>> 0
    return ((s ^ (s >>> 16)) >>> 0) / 4294967296
  }
}

function pickTags(rng: () => number, count: number): TagKey[] {
  const pool = [...TAG_POOL]
  const picked: TagKey[] = []
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length)
    picked.push(pool[idx])
    pool.splice(idx, 1)
  }
  return picked
}

function generateReviewsFor(parkingLotSeq: string, count: number, daysSpread: number): Review[] {
  const rng = pseudoRandom(`reviews:${parkingLotSeq}`)
  const now = Date.now()
  const reviews: Review[] = []
  for (let i = 0; i < count; i++) {
    const ratingRoll = rng()
    const rating = ratingRoll < 0.5 ? 4 : ratingRoll < 0.8 ? 5 : ratingRoll < 0.95 ? 3 : 2
    const tagCount = Math.floor(rng() * 3) + 1
    const tags = pickTags(rng, tagCount)
    const daysAgo = Math.floor(rng() * daysSpread)
    const hourEnter = 9 + Math.floor(rng() * 11)
    const minuteEnter = Math.floor(rng() * 60)
    const durationMin = 30 + Math.floor(rng() * 180)
    const enter = new Date(now - daysAgo * 86_400_000)
    enter.setHours(hourEnter, minuteEnter, 0, 0)
    const exit = new Date(enter.getTime() + durationMin * 60_000)
    const commentIdx = Math.floor(rng() * SAMPLE_COMMENTS.length)
    reviews.push({
      id: `r-${parkingLotSeq}-${i}`,
      paymentSeq: `pay-${parkingLotSeq}-${i}`,
      parkingLotSeq,
      nickname: generateNickname(`${parkingLotSeq}-${i}`),
      rating,
      content: SAMPLE_COMMENTS[commentIdx],
      tags,
      enterTime: enter.toISOString(),
      exitTime: exit.toISOString(),
      status: 1,
      createdAt: new Date(now - daysAgo * 86_400_000 - Math.floor(rng() * 3600_000)).toISOString()
    })
  }
  return reviews.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

// 새 ParkingLot seq(1024 ~ 1199)에 맞춘 review count.
// 디자인 시안의 totalCount 값을 직접 반영해서 카드·통계가 자연스럽게 채워지도록.
const REVIEW_COUNT_BY_SEQ: Record<string, number> = {
  '1024': 38, // 강남 N타워 (시안 187 → 18 cap 적용)
  '1037': 28, // 홍대입구 공영
  '1052': 22, // 성수 연무장길
  '1071': 45, // 잠실 롯데 P3 (가장 많음)
  '1083': 32, // 여의도 IFC
  '1099': 24, // 판교 H스퀘어
  '1112': 14, // 연남동 새마을
  '1125': 18, // 성수 디뮤지엄
  '1142': 36, // 잠실 종합운동장
  '1156': 26, // 강남 GT타워
  '1178': 30, // 여의도 더현대
  '1199': 20, // 판교 알파돔시티
  // 후방 호환 (혹시 기존 seq 참조하는 곳)
  '101': 28,
  '102': 14,
  '103': 9,
  '104': 22,
  '201': 31,
  '202': 18,
  '203': 7,
  '301': 24,
  '302': 11,
  '303': 16,
  '401': 35,
  '402': 19,
  '403': 8,
  '501': 26,
  '502': 21,
  '503': 13,
  '601': 17,
  '602': 12,
  '603': 6,
  '701': 9,
  '801': 14
}

export const MOCK_REVIEWS: Record<string, Review[]> = Object.fromEntries(
  Object.entries(REVIEW_COUNT_BY_SEQ).map(([seq, count]) => [seq, generateReviewsFor(seq, count, 21)])
)

export function getReviewsBySeq(parkingLotSeq: string): Review[] {
  return MOCK_REVIEWS[parkingLotSeq] ?? []
}

export function getWeeklyNewReviewCount(parkingLotSeq: string): number {
  const oneWeekAgo = Date.now() - 7 * 86_400_000
  return getReviewsBySeq(parkingLotSeq).filter((r) => new Date(r.createdAt).getTime() >= oneWeekAgo).length
}

export function getRecentReviewCount(parkingLotSeq: string, hoursAgo: number): number {
  const since = Date.now() - hoursAgo * 3600_000
  return getReviewsBySeq(parkingLotSeq).filter((r) => new Date(r.createdAt).getTime() >= since).length
}
