export const APP_NAME = 'Trace' as const
export const APP_TAGLINE = '주차장 흔적' as const
export const APP_DESCRIPTION = '주차권을 사용한 사람만 남기는 익명 주차장 리뷰' as const
export const APP_HOST = 'https://trace.modu.kr' as const

export const TRACE_TOKEN_TTL_HOURS = 24
export const REVIEW_CONTENT_MAX_LENGTH = 500

export const POPULAR_AREAS = [
  { key: 'gangnam', label: '강남' },
  { key: 'hongdae', label: '홍대' },
  { key: 'seongsu', label: '성수' },
  { key: 'jamsil', label: '잠실' },
  { key: 'yeouido', label: '여의도' },
  { key: 'pangyo', label: '판교' },
  { key: 'itaewon', label: '이태원' },
  { key: 'myeongdong', label: '명동' }
] as const

export type AreaKey = (typeof POPULAR_AREAS)[number]['key']
