export interface LoginRequest {
  email: string
  password: string
  deviceType: 'android' | 'iphone'
  deviceToken: string
  version: string
}

export type SocialLoginProvider = 'kakao' | 'naver'

export interface SocialLoginRequest {
  provider: SocialLoginProvider
  accessToken: string
  deviceType: 'android' | 'iphone' | 'web'
  deviceToken: string
  version: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  userVerificationId?: string
}

export interface UserAuth {
  isKakao?: boolean
  isNaver?: boolean
  isApple?: boolean
  isFacebook?: boolean
}

export interface UserProfile {
  userSeq: string
  email: string
  userName: string
  phone?: string
  isVerifiedUser: boolean
  profileThumbnail?: string
  userAuth: UserAuth
}
