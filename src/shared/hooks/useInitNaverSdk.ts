'use client'

import { useEffect, useState } from 'react'

/**
 * 네이버 지도 SDK 동적 로더.
 * 처음 호출 시 <script>를 head에 삽입하고 로드 완료를 알림.
 * 이미 로드되어 있으면 즉시 true. 에러 시 throw.
 */
const useInitNaverSdk = () => {
  const [isLoadScript, setIsLoadScript] = useState(false)
  const [isLoadError, setIsLoadError] = useState(false)

  useEffect(() => {
    if (window.naver) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoadScript(true)
      return
    }
    const naverScript = document.createElement('script')
    naverScript.async = true
    naverScript.type = 'text/javascript'
    naverScript.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAPS_KEY}&submodules=geocoder`

    document.head.appendChild(naverScript)

    naverScript.onload = () => {
      if (window.naver) {
        setIsLoadScript(true)
      } else {
        setIsLoadScript(false)
      }
    }

    naverScript.onerror = () => {
      setIsLoadError(true)
    }
  }, [])

  if (isLoadError) {
    throw new Error(`지도를 불러오지 못했습니다.`)
  }

  return { isLoadScript }
}

export { useInitNaverSdk }
