'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore } from 'react'

import type { ExtractedReceipt, VerifySource } from '../model'
import { useAuthStore } from '@/shared/stores/authStore'

import { extractReceipt } from '../model'

// SSR-safe hydration flag — useSyncExternalStore로 hook 규칙 만족
const subscribe = () => () => {}
const getSnap = () => true
const getServerSnap = () => false

export type VerifyStage = 'pick' | 'uploaded' | 'scanning' | 'done'

export interface UploadedFile {
  name: string
  size: string
  source: string
}

export function useVerifyViewModel() {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const profile = useAuthStore((s) => s.profile)
  const setProfile = useAuthStore((s) => s.setProfile)

  const [stage, setStage] = useState<VerifyStage>('pick')
  const [file, setFile] = useState<UploadedFile | null>(null)
  const [extracted, setExtracted] = useState<ExtractedReceipt | null>(null)
  const hydrated = useSyncExternalStore(subscribe, getSnap, getServerSnap)

  // Auth gate — hydration 후 비로그인 상태면 /login?return=/verify로.
  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      router.replace('/login?return=/verify')
    }
  }, [hydrated, isLoggedIn, router])

  const pickSource = (source: VerifySource) => {
    setFile({ name: `${source.name} 이용내역.pdf`, size: '142KB', source: source.name })
    setStage('uploaded')
  }

  const pickFile = (f: File) => {
    setFile({
      name: f.name,
      size: `${Math.round(f.size / 1024)}KB`,
      source: '직접 업로드'
    })
    setStage('uploaded')
  }

  const reset = () => {
    setFile(null)
    setExtracted(null)
    setStage('pick')
  }

  const runScan = async () => {
    setStage('scanning')
    try {
      const result = await extractReceipt()
      setExtracted(result)
      setStage('done')
    } catch {
      setStage('uploaded')
    }
  }

  const finish = () => {
    if (!extracted) return
    // 검증 완료 → user의 isVerifiedUser true로 업데이트 (없으면 그대로)
    if (profile) {
      setProfile({ ...profile, isVerifiedUser: true })
    }
    setTimeout(() => router.push(`/write?token=demo-${extracted.parkingLotSeq}`), 200)
  }

  return {
    stage,
    file,
    extracted,
    canRender: hydrated && isLoggedIn,
    pickSource,
    pickFile,
    reset,
    runScan,
    finish
  }
}
