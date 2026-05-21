import { generateNickname } from '@/shared/lib/nickname'

export interface SignupPayload {
  email: string
  password: string
}

export interface SignupResult {
  email: string
  nickname: string
  verified: false
  joinedAt: number
}

/**
 * Mock 회원가입 — 백엔드 미연동 단계. 800ms 시뮬 후 user 객체 반환.
 * 실제 구현 시 `apiClient.post('/auth/signup', payload)` 형태로 교체.
 */
export async function signup(payload: SignupPayload): Promise<SignupResult> {
  await new Promise((r) => setTimeout(r, 700))
  return {
    email: payload.email,
    nickname: generateNickname(payload.email),
    verified: false,
    joinedAt: Date.now()
  }
}

export async function signupWithOAuth(provider: 'kakao' | 'naver' | 'google'): Promise<SignupResult> {
  await new Promise((r) => setTimeout(r, 600))
  return {
    email: `${provider}_user@modu.kr`,
    nickname: generateNickname(provider + Date.now()),
    verified: false,
    joinedAt: Date.now()
  }
}
