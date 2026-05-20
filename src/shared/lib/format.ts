import { format, formatDistanceToNowStrict } from 'date-fns'
import { ko } from 'date-fns/locale'

export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR')
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function formatRevisitRate(rate: number): string {
  return `${Math.round(rate * 100)}%`
}

export function formatRelativeTime(iso: string): string {
  try {
    return formatDistanceToNowStrict(new Date(iso), { addSuffix: true, locale: ko })
  } catch {
    return iso
  }
}

export function formatVisitWindow(enterIso: string, exitIso: string): string {
  try {
    const enter = new Date(enterIso)
    const exit = new Date(exitIso)
    const sameDay = format(enter, 'yyyyMMdd') === format(exit, 'yyyyMMdd')
    const dayLabel = format(enter, 'M월 d일 (E)', { locale: ko })
    const enterT = format(enter, 'HH:mm')
    const exitT = format(exit, 'HH:mm')
    const durationMs = exit.getTime() - enter.getTime()
    const hours = Math.floor(durationMs / 3600_000)
    const minutes = Math.round((durationMs % 3600_000) / 60_000)
    const durationLabel = `${hours > 0 ? `${hours}시간 ` : ''}${minutes}분`
    return sameDay ? `${dayLabel} ${enterT}~${exitT}, ${durationLabel}` : `${enterT} ~ ${exitT}`
  } catch {
    return ''
  }
}
