'use client'

import { useState } from 'react'

import { IcoStar } from '@/shared/components/icons'

interface StarRatingProps {
  value: number
  size?: number
  className?: string
}

export function StarRatingDisplay({ value, size = 14, className = '' }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5]
  return (
    <span className={`inline-flex items-center gap-px ${className}`} aria-label={`별점 ${value} / 5`}>
      {stars.map((n) => (
        <IcoStar
          key={n}
          width={size}
          height={size}
          filled={n <= Math.round(value)}
          className={n <= Math.round(value) ? 'text-[var(--color-star)]' : 'text-stroke-sub'}
        />
      ))}
    </span>
  )
}

interface StarRatingInputProps {
  value: number
  onChange: (v: number) => void
  size?: number
}

export function StarRatingInput({ value, onChange, size = 36 }: StarRatingInputProps) {
  const [hover, setHover] = useState<number | null>(null)
  const displayed = hover ?? value
  return (
    <div role="radiogroup" aria-label="별점" className="inline-flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n}점`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(null)}
          className="cursor-pointer p-0.5 transition-transform hover:scale-110 active:scale-95"
        >
          <IcoStar
            width={size}
            height={size}
            filled={n <= displayed}
            className={n <= displayed ? 'text-[var(--color-star)]' : 'text-stroke-sub'}
          />
        </button>
      ))}
    </div>
  )
}
