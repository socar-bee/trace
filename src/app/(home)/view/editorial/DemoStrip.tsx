import Link from 'next/link'

export default function DemoStrip() {
  return (
    <div className="bg-fg text-bg font-mono text-[11px]">
      <div className="mx-auto flex max-w-[1200px] justify-end px-6 py-2">
        <Link
          href="/write?token=demo-1024"
          className="border-b border-dashed border-neutral-600 pb-px transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          후기 남기기 →
        </Link>
      </div>
    </div>
  )
}
