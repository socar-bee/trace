'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import useDebounce from '@/shared/hooks/useDebounce'
import { addRecentSearch } from '@/shared/hooks/useRecentSearches'

import { fetchSearchPlace, type SearchPlace } from '@/shared/lib/poi'

import type { PopularParkingLot } from '@/shared/types/trace'

import { searchParkingLotsWithStats } from '@/shared/mocks/api'

interface UseSearchViewModelArgs {
  initialKeyword: string
  initialKeywordResults: PopularParkingLot[]
}

export function useSearchViewModel({ initialKeyword, initialKeywordResults }: UseSearchViewModelArgs) {
  const router = useRouter()
  const [input, setInput] = useState(initialKeyword)
  const debounced = useDebounce(input, 400)

  const [places, setPlaces] = useState<SearchPlace[]>([])
  const [parkingLots, setParkingLots] = useState<PopularParkingLot[]>(
    initialKeyword.length >= 2 ? initialKeywordResults : []
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = debounced.trim()

    if (q.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlaces([])
      setParkingLots([])
      return
    }
    // 2글자 미만은 검색 안 함
    if (q.length < 2) {
      setPlaces([])
      setParkingLots([])
      return
    }

    let cancelled = false

    setLoading(true)
    Promise.all([fetchSearchPlace(q), searchParkingLotsWithStats(q)]).then(([poi, lots]) => {
      if (cancelled) return
      setPlaces(poi)
      setParkingLots(lots)
      setLoading(false)
      addRecentSearch(q)
    })
    return () => {
      cancelled = true
    }
  }, [debounced])

  const submit = (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  const reset = () => {
    setInput('')
  }

  return {
    input,
    setInput,
    debounced,
    places,
    parkingLots,
    loading,
    submit,
    reset
  }
}
