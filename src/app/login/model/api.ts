import apiClient, { isApiConfigured } from '@/shared/lib/apiClient'

import type { LoginRequest, LoginResponse, SocialLoginRequest, UserProfile } from '@/shared/types/auth'

/**
 * 이메일 로그인 — 본진 모주 API.
 * POST {baseURL}/user/login
 */
export async function login(body: LoginRequest): Promise<LoginResponse> {
  if (!isApiConfigured) {
    // 데모 모드: 환경변수 미설정 시 mock 로그인
    return mockLoginResponse(body.email)
  }
  const { data } = await apiClient.post<{ data: LoginResponse }>('/user/login', body)
  return data.data
}

export async function socialLogin(body: SocialLoginRequest): Promise<LoginResponse> {
  if (!isApiConfigured) {
    return mockLoginResponse(`${body.provider}@demo.trace`)
  }
  const { data } = await apiClient.post<{ data: LoginResponse }>('/login/social', body)
  return data.data
}

export async function getProfile(token: string): Promise<UserProfile> {
  if (!isApiConfigured || token.startsWith('demo-')) {
    return mockProfile(token)
  }
  const { data } = await apiClient.get<{ data: UserProfile }>('/user/profile', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return data.data
}

// ─── Mock (백엔드 붙기 전 데모용) ──────────────────────────────

function mockLoginResponse(email: string): LoginResponse {
  return {
    accessToken: `demo-access-${Date.now()}`,
    refreshToken: `demo-refresh-${Date.now()}`,
    userVerificationId: `demo-${btoa(email).slice(0, 12)}`
  }
}

function mockProfile(token: string): UserProfile {
  const userSeq = token.replace(/^demo-/, '').slice(0, 8) || 'demo'
  return {
    userSeq,
    email: `demo-${userSeq}@trace.demo`,
    userName: '데모 운전자',
    isVerifiedUser: true,
    userAuth: {}
  }
}
