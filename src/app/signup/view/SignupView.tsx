'use client'

import Link from 'next/link'

import { IcoEmail, IcoKakao, IcoNaver, IcoTireMark } from '@/shared/components/icons'

import { useSignupViewModel } from '../viewmodel'

export default function SignupView() {
  const vm = useSignupViewModel()

  return (
    <div className="bg-bg-white flex min-h-dvh w-full flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="flex flex-col items-center">
        <span className="inline-flex items-baseline gap-1.5">
          <span className="text-text-strong text-4xl font-black tracking-tighter">Trace</span>
          <IcoTireMark className="text-brand-500 mb-1" width={32} height={9} />
        </span>
        <p
          className="text-text-sub mt-2 text-center"
          style={{ fontSize: 'var(--font-size-c2)', lineHeight: 'var(--font-size-c2--line-height)' }}
        >
          가본 사람만 남기는 진짜 주차장 후기
        </p>
      </div>

      {!vm.showEmailForm ? (
        <>
          {/* Social Signup Buttons */}
          <div className="mt-8 flex w-full max-w-[320px] flex-col gap-2.5">
            <button
              onClick={() => void vm.handleKakaoSignup()}
              disabled={vm.loading}
              className="rounded-12 flex w-full items-center justify-center gap-2 bg-[#FEE500] py-3.5 text-[14px] font-bold text-[#191919] transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50"
            >
              <IcoKakao />
              카카오로 3초만에 시작하기
            </button>

            <button
              onClick={() => void vm.handleNaverSignup()}
              disabled={vm.loading}
              className="rounded-12 text-static-white flex w-full items-center justify-center gap-2 bg-[#03C75A] py-3.5 text-[14px] font-bold transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50"
            >
              <IcoNaver />
              네이버로 시작하기
            </button>

            <button
              onClick={vm.openEmailForm}
              className="rounded-12 text-static-white flex w-full items-center justify-center gap-2 bg-neutral-800 py-3.5 text-[14px] font-bold transition-opacity hover:opacity-90 active:opacity-80"
            >
              <IcoEmail />
              이메일로 시작하기
            </button>
          </div>

          {vm.error && (
            <p className="text-error-base mt-3 max-w-[320px] text-center" style={{ fontSize: 'var(--font-size-c2)' }}>
              {vm.error}
            </p>
          )}

          {/* Login + Guest */}
          <div
            className="text-text-sub mt-6 flex items-center gap-3 font-medium"
            style={{ fontSize: 'var(--font-size-c1)' }}
          >
            <Link href="/login" className="hover:text-brand-700 transition-colors">
              로그인
            </Link>
            <span className="bg-stroke-soft block h-3 w-px" />
            <Link href="/" className="hover:text-text-strong transition-colors">
              비회원으로 둘러보기
            </Link>
          </div>

          {/* Terms */}
          <p
            className="text-text-soft mt-6 max-w-[320px] text-center leading-[16px]"
            style={{ fontSize: 'var(--font-size-c4)' }}
          >
            로그인·회원가입 시{' '}
            <Link href="#" className="underline">
              이용약관
            </Link>{' '}
            및{' '}
            <Link href="#" className="underline">
              개인정보처리방침
            </Link>
            에 동의하게 됩니다
          </p>
        </>
      ) : (
        <>
          {/* Email Signup Form */}
          <div className="mt-8 flex w-full max-w-[320px] flex-col gap-3">
            <div>
              <label className="text-text-sub mb-1 block text-[12px] font-medium">이메일</label>
              <input
                type="email"
                value={vm.email}
                onChange={(e) => vm.setEmail(e.target.value)}
                placeholder="example@moduparking.com"
                className="rounded-12 border-stroke-soft text-text-strong placeholder:text-text-soft focus:border-brand-500 w-full border-2 px-3.5 py-3 text-[14px] transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-text-sub mb-1 block text-[12px] font-medium">
                비밀번호 <span className="text-text-soft text-[11px] font-normal">(8자 이상)</span>
              </label>
              <input
                type="password"
                value={vm.password}
                onChange={(e) => vm.setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                minLength={8}
                className="rounded-12 border-stroke-soft text-text-strong placeholder:text-text-soft focus:border-brand-500 w-full border-2 px-3.5 py-3 text-[14px] transition-colors outline-none"
                onKeyDown={(e) => e.key === 'Enter' && void vm.handleEmailSignup()}
              />
            </div>

            <label className="text-text-sub mt-1 flex cursor-pointer items-start gap-2 text-[13px]">
              <input
                type="checkbox"
                checked={vm.agreeAll}
                onChange={(e) => vm.setAgreeAll(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                이용약관·개인정보처리방침에 모두 동의합니다
                <span className="text-brand-500 ml-1 font-semibold">(필수)</span>
              </span>
            </label>

            {vm.error && <p className="text-error-base text-[12px]">{vm.error}</p>}

            <button
              onClick={() => void vm.handleEmailSignup()}
              disabled={vm.loading || !vm.email || !vm.password || !vm.agreeAll}
              className="rounded-12 bg-brand-500 hover:bg-brand-700 active:bg-brand-900 text-static-white mt-1 w-full py-3.5 text-[14px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {vm.loading ? '가입 중...' : '회원가입'}
            </button>

            <button
              onClick={vm.closeEmailForm}
              className="text-text-sub hover:text-text-strong text-[13px] font-medium"
            >
              다른 방법으로 가입
            </button>
          </div>
        </>
      )}
    </div>
  )
}
