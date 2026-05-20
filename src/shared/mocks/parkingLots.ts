import type { ParkingLot } from '@/shared/types/trace'

export const MOCK_PARKING_LOTS: ParkingLot[] = [
  {
    seq: '101',
    name: '강남역 센터필드 주차장',
    address: '서울 강남구 테헤란로 231',
    latitude: 37.5004,
    longitude: 127.0264,
    hourlyPrice: 4800,
    areaKey: 'gangnam'
  },
  {
    seq: '102',
    name: '강남 GT타워 주차장',
    address: '서울 강남구 강남대로 411',
    latitude: 37.5045,
    longitude: 127.0246,
    hourlyPrice: 4000,
    areaKey: 'gangnam'
  },
  {
    seq: '103',
    name: '논현 르네상스 주차장',
    address: '서울 강남구 언주로 508',
    latitude: 37.5106,
    longitude: 127.0297,
    hourlyPrice: 3600,
    areaKey: 'gangnam'
  },
  {
    seq: '104',
    name: '신논현 더피나클 주차장',
    address: '서울 강남구 강남대로 538',
    latitude: 37.5042,
    longitude: 127.0252,
    hourlyPrice: 5000,
    areaKey: 'gangnam'
  },
  {
    seq: '201',
    name: '홍대입구역 와이즈파크 주차장',
    address: '서울 마포구 양화로 160',
    latitude: 37.5566,
    longitude: 126.9229,
    hourlyPrice: 3000,
    areaKey: 'hongdae'
  },
  {
    seq: '202',
    name: '홍대 AK& 주차장',
    address: '서울 마포구 양화로 188',
    latitude: 37.5557,
    longitude: 126.9209,
    hourlyPrice: 3600,
    areaKey: 'hongdae'
  },
  {
    seq: '203',
    name: '상수동 메세나폴리스 주차장',
    address: '서울 마포구 양화로 45',
    latitude: 37.5479,
    longitude: 126.9181,
    hourlyPrice: 3000,
    areaKey: 'hongdae'
  },
  {
    seq: '301',
    name: '성수 디뮤지엄 주차장',
    address: '서울 성동구 왕십리로 83',
    latitude: 37.5447,
    longitude: 127.0557,
    hourlyPrice: 3200,
    areaKey: 'seongsu'
  },
  {
    seq: '302',
    name: '성수동 코오롱 주차장',
    address: '서울 성동구 성수이로 113',
    latitude: 37.5447,
    longitude: 127.0568,
    hourlyPrice: 2800,
    areaKey: 'seongsu'
  },
  {
    seq: '303',
    name: '서울숲 갤러리아포레 주차장',
    address: '서울 성동구 서울숲2길 32',
    latitude: 37.5444,
    longitude: 127.0411,
    hourlyPrice: 4000,
    areaKey: 'seongsu'
  },
  {
    seq: '401',
    name: '잠실 롯데월드몰 주차장',
    address: '서울 송파구 올림픽로 300',
    latitude: 37.5125,
    longitude: 127.1025,
    hourlyPrice: 5000,
    areaKey: 'jamsil'
  },
  {
    seq: '402',
    name: '잠실역 시그니엘 주차장',
    address: '서울 송파구 올림픽로 300',
    latitude: 37.5133,
    longitude: 127.1043,
    hourlyPrice: 6000,
    areaKey: 'jamsil'
  },
  {
    seq: '403',
    name: '잠실 종합운동장 주차장',
    address: '서울 송파구 올림픽로 25',
    latitude: 37.515,
    longitude: 127.0731,
    hourlyPrice: 2400,
    areaKey: 'jamsil'
  },
  {
    seq: '501',
    name: '여의도 IFC몰 주차장',
    address: '서울 영등포구 국제금융로 10',
    latitude: 37.525,
    longitude: 126.9251,
    hourlyPrice: 5200,
    areaKey: 'yeouido'
  },
  {
    seq: '502',
    name: '여의도 더현대 주차장',
    address: '서울 영등포구 여의대로 108',
    latitude: 37.5266,
    longitude: 126.9281,
    hourlyPrice: 4400,
    areaKey: 'yeouido'
  },
  {
    seq: '503',
    name: '여의도 파크원 주차장',
    address: '서울 영등포구 여의대로 108',
    latitude: 37.5258,
    longitude: 126.9276,
    hourlyPrice: 4800,
    areaKey: 'yeouido'
  },
  {
    seq: '601',
    name: '판교 알파돔시티 주차장',
    address: '경기 성남시 분당구 분당내곡로 117',
    latitude: 37.3958,
    longitude: 127.1117,
    hourlyPrice: 3200,
    areaKey: 'pangyo'
  },
  {
    seq: '602',
    name: '판교 현대백화점 주차장',
    address: '경기 성남시 분당구 판교역로 146',
    latitude: 37.3947,
    longitude: 127.1116,
    hourlyPrice: 3000,
    areaKey: 'pangyo'
  },
  {
    seq: '603',
    name: '판교 테크원 주차장',
    address: '경기 성남시 분당구 분당내곡로 131',
    latitude: 37.3974,
    longitude: 127.1085,
    hourlyPrice: 2800,
    areaKey: 'pangyo'
  },
  {
    seq: '701',
    name: '이태원 해밀톤호텔 주차장',
    address: '서울 용산구 이태원로 179',
    latitude: 37.5347,
    longitude: 126.9947,
    hourlyPrice: 3600,
    areaKey: 'itaewon'
  },
  {
    seq: '801',
    name: '명동 신세계백화점 주차장',
    address: '서울 중구 소공로 63',
    latitude: 37.5611,
    longitude: 126.9819,
    hourlyPrice: 5600,
    areaKey: 'myeongdong'
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
  return MOCK_PARKING_LOTS.filter((p) => p.name.toLowerCase().includes(k) || p.address.toLowerCase().includes(k))
}
