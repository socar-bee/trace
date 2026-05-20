'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

export function useHomeViewModel() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')

  const submit = useCallback(() => {
    const k = keyword.trim()
    if (!k) return
    router.push(`/search?q=${encodeURIComponent(k)}`)
  }, [keyword, router])

  return {
    keyword,
    setKeyword,
    canSubmit: keyword.trim().length > 0,
    submit
  }
}
