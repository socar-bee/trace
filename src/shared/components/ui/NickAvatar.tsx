import { NICK_COLOR_HEX, parseNickname } from '@/shared/lib/nickname'

type NickAvatarStyle = 'initial' | 'mono' | 'dot'

interface NickAvatarProps {
  nickname: string
  style?: NickAvatarStyle
  /** 닉네임 텍스트 표시 여부 (false면 아바타만) */
  showName?: boolean
  className?: string
}

/**
 * 닉네임 아바타 — 핸드오프 명세대로 3가지 표현.
 * - initial: brand-50 fill + 동물 첫글자 (기본)
 * - mono: 검은 fill + 흰 글자
 * - dot: 닉네임의 색상 풀에 따라 채색
 *
 * 핸드오프 명세: radius-pill (rounded-full), 26×26.
 */
export default function NickAvatar({ nickname, style = 'initial', showName = true, className = '' }: NickAvatarProps) {
  const parsed = parseNickname(nickname)

  if (!parsed) {
    return <span className={`text-fg text-sm font-medium ${className}`.trim()}>{nickname}</span>
  }

  const initial = parsed.animal.charAt(0)

  const avatarBase =
    'inline-flex size-[26px] shrink-0 items-center justify-center rounded-full border border-line-2 font-mono text-[11px]'
  const avatarStyle =
    style === 'mono'
      ? 'bg-fg text-bg'
      : style === 'dot'
        ? 'border-transparent text-static-white'
        : 'bg-brand-50 text-fg'

  return (
    <span className={`inline-flex items-center gap-2 text-[13px] whitespace-nowrap ${className}`.trim()}>
      <span
        className={`${avatarBase} ${avatarStyle}`}
        aria-hidden
        style={style === 'dot' ? { background: NICK_COLOR_HEX[parsed.color] ?? '#888' } : undefined}
      >
        {style === 'dot' ? <span className="text-[9px]">{initial}</span> : initial}
      </span>
      {showName && <span className="text-fg text-sm font-medium">{parsed.full}</span>}
    </span>
  )
}
