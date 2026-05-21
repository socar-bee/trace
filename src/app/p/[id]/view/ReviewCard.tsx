'use client'

import NickAvatar from '@/shared/components/ui/NickAvatar'
import { StarRatingDisplay } from '@/shared/components/ui/StarRating'
import TagPill from '@/shared/components/ui/Tag'

import { formatRelativeTime, formatVisitWindow } from '@/shared/lib/format'

import type { Review } from '@/shared/types/trace'

interface ReviewCardProps {
  review: Review
  onReport?: (review: Review) => void
}

export default function ReviewCard({ review, onReport }: ReviewCardProps) {
  return (
    <article className="border-stroke-soft border-b py-5 last:border-b-0 md:py-6">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <NickAvatar nickname={review.nickname} style="initial" />
          <p className="text-text-soft mt-1 text-xs">
            {formatVisitWindow(review.enterTime, review.exitTime)} · {formatRelativeTime(review.createdAt)}
          </p>
        </div>
        <StarRatingDisplay value={review.rating} size={14} />
      </header>

      {review.content && (
        <p className="text-text-strong mt-3 text-sm leading-relaxed md:text-[15px]">{review.content}</p>
      )}

      {review.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {review.tags.map((t) => (
            <TagPill key={t} tag={t} />
          ))}
        </div>
      )}

      {onReport && (
        <button
          type="button"
          onClick={() => onReport(review)}
          className="text-text-soft hover:text-text-strong mt-3 text-xs underline-offset-4 hover:underline"
        >
          신고
        </button>
      )}
    </article>
  )
}
