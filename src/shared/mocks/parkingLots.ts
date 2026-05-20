import type { ParkingLot } from '@/shared/types/trace'

export const MOCK_PARKING_LOTS: ParkingLot[] = [
  {
    seq: '1024',
    name: '강남 N타워 지하주차장',
    areaKey: 'gangnam',
    areaLabel: '강남',
    address: '서울 강남구 테헤란로 152',
    addrRoad: '37.5009°N · 127.0367°E',
    latitude: 37.5009,
    longitude: 127.0367,
    hourlyPrice: 3600,
    pricePer: 600,
    priceUnit: '10분',
    open: '24시간',
    totalSpots: 412,
    gateType: 'LPR · 무인',
    badges: ['LPR', '카드/모주페이'],
    hot: true
  },
  {
    seq: '1037',
    name: '홍대입구 공영주차장',
    areaKey: 'hongdae',
    areaLabel: '홍대',
    address: '서울 마포구 양화로 162',
    addrRoad: '37.5572°N · 126.9249°E',
    latitude: 37.5572,
    longitude: 126.9249,
    hourlyPrice: 2400,
    pricePer: 400,
    priceUnit: '10분',
    open: '24시간',
    totalSpots: 88,
    gateType: '차단기 · 유인',
    badges: ['공영', '현금가능'],
    hot: true
  },
  {
    seq: '1052',
    name: '성수 연무장길 주차타워',
    areaKey: 'seongsu',
    areaLabel: '성수',
    address: '서울 성동구 연무장길 41',
    addrRoad: '37.5447°N · 127.0573°E',
    latitude: 37.5447,
    longitude: 127.0573,
    hourlyPrice: 4800,
    pricePer: 800,
    priceUnit: '10분',
    open: '06–24시',
    totalSpots: 156,
    gateType: '기계식 4단',
    badges: ['기계식', '발레가능'],
    hot: true
  },
  {
    seq: '1071',
    name: '잠실 롯데 P3',
    areaKey: 'jamsil',
    areaLabel: '잠실',
    address: '서울 송파구 올림픽로 300',
    addrRoad: '37.5125°N · 127.1025°E',
    latitude: 37.5125,
    longitude: 127.1025,
    hourlyPrice: 3000,
    pricePer: 500,
    priceUnit: '10분',
    open: '24시간',
    totalSpots: 2200,
    gateType: 'LPR · 무인',
    badges: ['LPR', '대형'],
    hot: true
  },
  {
    seq: '1083',
    name: '여의도 IFC몰 B2',
    areaKey: 'yeouido',
    areaLabel: '여의도',
    address: '서울 영등포구 국제금융로 10',
    addrRoad: '37.5247°N · 126.9249°E',
    latitude: 37.5247,
    longitude: 126.9249,
    hourlyPrice: 6000,
    pricePer: 1000,
    priceUnit: '10분',
    open: '24시간',
    totalSpots: 1180,
    gateType: 'LPR · 무인',
    badges: ['LPR', '쇼핑몰']
  },
  {
    seq: '1099',
    name: '판교 H스퀘어 지하',
    areaKey: 'pangyo',
    areaLabel: '판교',
    address: '경기 성남시 분당구 판교역로 235',
    addrRoad: '37.3955°N · 127.1107°E',
    latitude: 37.3955,
    longitude: 127.1107,
    hourlyPrice: 1800,
    pricePer: 300,
    priceUnit: '10분',
    open: '24시간',
    totalSpots: 540,
    gateType: 'LPR · 무인',
    badges: ['LPR', '오피스']
  },
  {
    seq: '1112',
    name: '연남동 새마을 노상',
    areaKey: 'hongdae',
    areaLabel: '홍대',
    address: '서울 마포구 동교로27길 24',
    addrRoad: '37.5634°N · 126.9237°E',
    latitude: 37.5634,
    longitude: 126.9237,
    hourlyPrice: 1200,
    pricePer: 200,
    priceUnit: '10분',
    open: '07–22시',
    totalSpots: 28,
    gateType: '미터기',
    badges: ['노상', '저렴']
  },
  {
    seq: '1125',
    name: '성수 디뮤지엄 부속',
    areaKey: 'seongsu',
    areaLabel: '성수',
    address: '서울 성동구 왕십리로 83',
    addrRoad: '37.5421°N · 127.0537°E',
    latitude: 37.5421,
    longitude: 127.0537,
    hourlyPrice: 4200,
    pricePer: 700,
    priceUnit: '10분',
    open: '10–22시',
    totalSpots: 64,
    gateType: '차단기 · 유인',
    badges: ['전시연계']
  },
  {
    seq: '1142',
    name: '잠실 종합운동장',
    areaKey: 'jamsil',
    areaLabel: '잠실',
    address: '서울 송파구 올림픽로 25',
    addrRoad: '37.515°N · 127.0731°E',
    latitude: 37.515,
    longitude: 127.0731,
    hourlyPrice: 2400,
    pricePer: 400,
    priceUnit: '10분',
    open: '24시간',
    totalSpots: 1850,
    gateType: 'LPR · 무인',
    badges: ['공영', '대형'],
    hot: true
  },
  {
    seq: '1156',
    name: '강남 GT타워',
    areaKey: 'gangnam',
    areaLabel: '강남',
    address: '서울 강남구 강남대로 411',
    addrRoad: '37.5045°N · 127.0246°E',
    latitude: 37.5045,
    longitude: 127.0246,
    hourlyPrice: 4000,
    pricePer: 700,
    priceUnit: '10분',
    open: '24시간',
    totalSpots: 320,
    gateType: 'LPR · 무인',
    badges: ['LPR', '오피스']
  },
  {
    seq: '1178',
    name: '여의도 더현대',
    areaKey: 'yeouido',
    areaLabel: '여의도',
    address: '서울 영등포구 여의대로 108',
    addrRoad: '37.5266°N · 126.9281°E',
    latitude: 37.5266,
    longitude: 126.9281,
    hourlyPrice: 4400,
    pricePer: 750,
    priceUnit: '10분',
    open: '10:30–20:00',
    totalSpots: 980,
    gateType: 'LPR · 무인',
    badges: ['LPR', '쇼핑몰', '주말만차']
  },
  {
    seq: '1199',
    name: '판교 알파돔시티',
    areaKey: 'pangyo',
    areaLabel: '판교',
    address: '경기 성남시 분당구 분당내곡로 117',
    addrRoad: '37.3958°N · 127.1117°E',
    latitude: 37.3958,
    longitude: 127.1117,
    hourlyPrice: 3200,
    pricePer: 550,
    priceUnit: '10분',
    open: '24시간',
    totalSpots: 720,
    gateType: 'LPR · 무인',
    badges: ['LPR', '오피스'],
    hot: true
  }
]

export function findParkingLotBySeq(seq: string): ParkingLot | undefined {
  return MOCK_PARKING_LOTS.find((p) => p.seq === seq)
}

export function findParkingLotsByArea(areaKey: string): ParkingLot[] {
  return MOCK_PARKING_LOTS.filter((p) => p.areaKey === areaKey)
}

export function searchParkingLots(keyword: string): ParkingLot[] {
  const k = keyword.trim().toLowerCase()
  if (!k) return []
  return MOCK_PARKING_LOTS.filter(
    (p) => p.name.toLowerCase().includes(k) || p.address.toLowerCase().includes(k) || p.areaLabel?.includes(k)
  )
}

/** Editorial UI 용 area 메타 (지역 + 누적 카운트) */
export const AREAS = [
  { key: 'gangnam', label: '강남', count: 247 },
  { key: 'hongdae', label: '홍대', count: 158 },
  { key: 'seongsu', label: '성수', count: 121 },
  { key: 'jamsil', label: '잠실', count: 203 },
  { key: 'yeouido', label: '여의도', count: 96 },
  { key: 'pangyo', label: '판교', count: 88 },
  { key: 'yongsan', label: '용산', count: 74 },
  { key: 'jongno', label: '종로', count: 62 }
] as const
