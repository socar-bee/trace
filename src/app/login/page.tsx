import type { Metadata } from 'next'

import LoginView from './view'

export const metadata: Metadata = {
  title: '로그인',
  description: '모두의주차장 계정으로 Trace에 로그인하세요.',
  robots: { index: false, follow: false }
}

export default function LoginPage() {
  return <LoginView />
}
