'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { SignupResult } from '../model'
import { useAuthStore } from '@/shared/stores/authStore'

import { signup, signupWithOAuth } from '../model'
import type { UserAuth, UserProfile } from '@/shared/types/auth'

function buildProfile(result: SignupResult, provider: 'email' | 'kakao' | 'naver' | 'google'): UserProfile {
  const userAuth: UserAuth = provider === 'kakao' ? { isKakao: true } : provider === 'naver' ? { isNaver: true } : {}
  return {
    userSeq: `mock-${result.joinedAt}`,
    email: result.email,
    userName: result.nickname,
    isVerifiedUser: false,
    userAuth
  }
}

export function useSignupViewModel() {
  const router = useRouter()
  const setTokens = useAuthStore((s) => s.setTokens)
  const setProfile = useAuthStore((s) => s.setProfile)

  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreeAll, setAgreeAll] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const persist = (result: SignupResult, provider: 'email' | 'kakao' | 'naver' | 'google') => {
    setTokens(`mock-access-${result.joinedAt}`, `mock-refresh-${result.joinedAt}`)
    setProfile(buildProfile(result, provider))
  }

  const handleEmailSignup = async () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요')
      return
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다')
      return
    }
    if (!agreeAll) {
      setError('약관에 동의해주세요')
      return
    }
    setError('')
    setLoading(true)
    try {
      const result = await signup({ email, password })
      persist(result, 'email')
      router.push('/verify?onboard=1')
    } catch {
      setError('회원가입 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleKakaoSignup = async () => {
    setLoading(true)
    try {
      const result = await signupWithOAuth('kakao')
      persist(result, 'kakao')
      router.push('/verify?onboard=1')
    } catch {
      setError('카카오 가입 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleNaverSignup = async () => {
    setLoading(true)
    try {
      const result = await signupWithOAuth('naver')
      persist(result, 'naver')
      router.push('/verify?onboard=1')
    } catch {
      setError('네이버 가입 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
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
    agreeAll,
    setAgreeAll,
    loading,
    error,
    handleEmailSignup,
    handleKakaoSignup,
    handleNaverSignup,
    openEmailForm,
    closeEmailForm
  }
}
