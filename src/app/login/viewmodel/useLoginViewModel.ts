'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { loadKakaoSDK, loginWithKakao, loginWithNaver } from '@/shared/lib/oauth'

import { useAuthStore } from '@/shared/stores/authStore'

import { getProfile, login } from '../model'

export function useLoginViewModel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('return') ?? '/'
  const { setTokens, setProfile } = useAuthStore()

  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요')
      return
    }
    setError('')
    setIsLoading(true)

    try {
      const deviceType: 'android' | 'iphone' =
        typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent) ? 'android' : 'iphone'

      const res = await login({
        email,
        password,
        deviceType,
        deviceToken: 'web',
        version: '1.0.0'
      })
      setTokens(res.accessToken, res.refreshToken, res.userVerificationId)

      try {
        const profile = await getProfile(res.accessToken)
        setProfile(profile)
      } catch {
        /* profile fetch 실패해도 로그인은 성공 */
      }

      router.push(returnTo)
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKakaoLogin = async () => {
    try {
      await loadKakaoSDK()
      loginWithKakao()
    } catch {
      setError('카카오 로그인을 시작할 수 없습니다. 환경변수(NEXT_PUBLIC_KAKAO_APP_KEY)를 확인해주세요.')
    }
  }

  const handleNaverLogin = () => {
    try {
      loginWithNaver()
    } catch {
      setError('네이버 로그인을 시작할 수 없습니다. 환경변수(NEXT_PUBLIC_NAVER_CLIENT_ID)를 확인해주세요.')
    }
  }

  const openEmailForm = () => setShowEmailForm(true)

  const closeEmailForm = () => {
    setShowEmailForm(false)
    setError('')
  }

  return {
    showEmailForm,
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleEmailLogin,
    handleKakaoLogin,
    handleNaverLogin,
    openEmailForm,
    closeEmailForm
  }
}
