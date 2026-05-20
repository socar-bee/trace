import apiClient, { isApiConfigured } from './apiClient'

export interface SearchPlace {
  name: string
  address: string
  latitude: number
  longitude: number
}

/**
 * 모주 본진 POI 검색 API.
 * - endpoint: `GET /poi/search/place?q=&type=naver`
 * - 2글자 이상에서만 호출
 * - 환경변수 미설정 / 네트워크 실패 시 빈 배열 반환 (graceful)
 */
export async function fetchSearchPlace(query: string): Promise<SearchPlace[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []
  if (!isApiConfigured) return []
  try {
    const { data } = await apiClient.get<{ data: { places: SearchPlace[] } }>(
      `/poi/search/place?q=${encodeURIComponent(trimmed)}&type=naver`
    )
    return data.data.places ?? []
  } catch {
    return []
  }
}
