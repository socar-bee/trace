'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedHeadingProps {
  text: string
  /** 글자 입력 속도 (ms / char) */
  charDelay?: number
}

/**
 * Hero H1 안에서 text를 한 글자씩 타이핑 (최초 mount 시 1회).
 * 타이핑 완료 후 caret만 blink로 살아있는 느낌 유지.
 */
export default function AnimatedHeading({ text, charDelay = 75 }: AnimatedHeadingProps) {
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    if (charCount >= text.length) return
    const id = setTimeout(() => setCharCount((c) => c + 1), charDelay)
    return () => clearTimeout(id)
  }, [charCount, text.length, charDelay])

  return (
    <span className="relative inline-block" aria-label={text}>
      <span>{text.slice(0, charCount)}</span>
      <motion.span
        className="text-accent ml-1 inline-block"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.5, 1] }}
        aria-hidden
      >
        |
      </motion.span>
    </span>
  )
}
