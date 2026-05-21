import type { Metadata } from 'next'

import { SignupView } from './view'

export const metadata: Metadata = {
  title: '회원가입',
  description: '모두의주차장 계정으로 Trace를 시작하세요.',
  robots: { index: false, follow: false }
}

export default function SignupPage() {
  return <SignupView />
}
