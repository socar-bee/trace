import Image from 'next/image'

import { IcoTireMark } from '@/shared/components/icons'

import { APP_DESCRIPTION, APP_NAME } from '@/shared/lib/constants'

export default function AppFooter() {
  return (
    <footer className="border-line mt-20 border-t">
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-6">
        {/* Brand */}
        <div className="flex flex-col gap-1.5">
          <span className="text-fg inline-flex items-baseline gap-1.5 text-lg font-extrabold tracking-[-0.02em]">
            {APP_NAME}
            <span
              className="bg-accent inline-block size-2 self-center"
              style={{ boxShadow: '2px 2px 0 var(--color-fg)' }}
              aria-hidden
            />
          </span>
          <span className="text-fg-2 text-xs">{APP_DESCRIPTION}</span>
        </div>

        {/* 차량이 지나간 자국 — Trace brand signature */}
        <div className="text-stroke-sub mt-8 flex items-center gap-2 opacity-40">
          <IcoTireMark width={28} height={7} />
          <IcoTireMark width={28} height={7} />
          <IcoTireMark width={28} height={7} />
          <IcoTireMark width={28} height={7} />
          <IcoTireMark width={28} height={7} />
        </div>

        {/* Bottom row */}
        <div className="border-line mt-6 flex flex-col items-start justify-between gap-2 border-t pt-4 sm:flex-row sm:items-center">
          <p className="text-fg-3 font-mono text-[10px] tracking-[0.06em] uppercase">
            © {new Date().getFullYear()} Trace. All rights reserved.
          </p>
          <p className="text-fg-3 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.06em] uppercase">
            powered by
            <Image src="/icons/icn_modu.svg" alt="" width={14} height={14} aria-hidden />
            <span className="text-fg font-bold">모두의주차장</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
