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

export interface ParsedNickname {
  color: string
  animal: string
  num: number
  full: string
}

export function parseNickname(nickname: string): ParsedNickname | null {
  const color = COLORS.find((c) => nickname.startsWith(c))
  if (!color) return null
  const rest = nickname.slice(color.length)
  const animal = ANIMALS.find((a) => rest.startsWith(a))
  if (!animal) return null
  const num = Number(rest.slice(animal.length))
  if (!Number.isFinite(num)) return null
  return { color, animal, num, full: nickname }
}

// 닉네임 컬러 풀의 hex 매핑 (NickAvatar의 'dot' 스타일에서 사용)
export const NICK_COLOR_HEX: Record<string, string> = {
  초록: '#3b7a4a',
  파란: '#3a6db8',
  빨간: '#b94a3c',
  노란: '#c79a2b',
  검은: '#1a1a1a',
  하얀: '#dcd6c5',
  보라: '#7a5a99',
  회색: '#8a8680',
  갈색: '#8a5a3b',
  분홍: '#d68aa5'
}
