import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_MODU_API_HOST

/**
 * 모주 본진 백엔드(POI 검색 등) 호출용 axios 인스턴스.
 * baseURL 환경변수가 없으면 호출 직전에 `isApiConfigured` 로 분기하고 mock fallback 한다.
 */
const apiClient = axios.create({
  baseURL,
  timeout: 5000
})

export const isApiConfigured = Boolean(baseURL)

export default apiClient
