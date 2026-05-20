const operatorList = ['하이파킹', '카카오 T', 'Tmap주차', '아마노', '나이스파크', 'TURU']

export function removeOperatorPrefix(name: string) {
  for (const prefix of operatorList) {
    if (name.startsWith(prefix)) {
      return name.substring(prefix.length).trim()
    }
  }
  return name
}

export function buildParkingLotTitle(name: string) {
  const cleaned = removeOperatorPrefix(name)
  return `${cleaned} 주차장 흔적 - Trace`
}
