const COLORS = ['초록', '파란', '빨간', '노란', '검은', '하얀', '보라', '회색', '갈색', '분홍'] as const
const ANIMALS = [
  '자동차',
  '호랑이',
  '여우',
  '사슴',
  '토끼',
  '다람쥐',
  '너구리',
  '늑대',
  '곰',
  '사자',
  '코끼리',
  '기린',
  '펭귄',
  '부엉이',
  '까마귀',
  '매',
  '독수리',
  '거북이',
  '고래',
  '돌고래'
] as const

function makeRng(seed: string): () => number {
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

export function generateNickname(carHash?: string): string {
  const rng = carHash ? makeRng(carHash) : Math.random
  const color = COLORS[Math.floor(rng() * COLORS.length)]
  const animal = ANIMALS[Math.floor(rng() * ANIMALS.length)]
  const num = 1000 + Math.floor(rng() * 9000)
  return `${color}${animal}${num}`
}
