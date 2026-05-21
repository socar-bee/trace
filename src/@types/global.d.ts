interface NaverLatLng {
  lat(): number
  lng(): number
}

interface NaverMapInstance {
  setCenter(latlng: NaverLatLng): void
  setZoom(level: number): void
  destroy?(): void
}

interface NaverMarkerInstance {
  setMap(map: NaverMapInstance | null): void
}

interface NaverMapOptions {
  center: NaverLatLng
  zoom?: number
  zoomControl?: boolean
  mapDataControl?: boolean
  scaleControl?: boolean
  logoControl?: boolean
  draggable?: boolean
  pinchZoom?: boolean
  scrollWheel?: boolean
  disableDoubleTapZoom?: boolean
  disableDoubleClickZoom?: boolean
  keyboardShortcuts?: boolean
}

interface NaverMarkerOptions {
  position: NaverLatLng
  map: NaverMapInstance
  title?: string
  icon?: unknown
}

interface Window {
  Kakao?: {
    init: (appKey: string) => void
    isInitialized: () => boolean
    Auth: {
      authorize: (options: { redirectUri: string; scope?: string }) => void
    }
    API: {
      request: (options: { url: string }) => Promise<{ id: number }>
    }
  }
  naver?: {
    maps: {
      Map: new (el: HTMLElement, options: NaverMapOptions) => NaverMapInstance
      LatLng: new (lat: number, lng: number) => NaverLatLng
      Marker: new (options: NaverMarkerOptions) => NaverMarkerInstance
    }
  }
}
