import { IcoTireMark } from '@/shared/components/icons'

import { APP_DESCRIPTION, APP_NAME } from '@/shared/lib/constants'

export default function AppFooter() {
  return (
    <footer className="border-stroke-soft mt-20 border-t">
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-6">
        <div className="flex flex-col gap-1">
          <span className="text-text-strong inline-flex items-baseline gap-1 text-lg font-black tracking-tighter">
            {APP_NAME}
            <IcoTireMark className="text-brand-500 mb-0.5" width={18} height={5} />
          </span>
          <span className="text-text-sub text-xs">{APP_DESCRIPTION}</span>
        </div>

        {/* 바닥에 차량이 지나간 후기 */}
        <div className="text-stroke-sub mt-8 flex items-center gap-2 opacity-50">
          <IcoTireMark width={28} height={7} />
          <IcoTireMark width={28} height={7} />
          <IcoTireMark width={28} height={7} />
          <IcoTireMark width={28} height={7} />
          <IcoTireMark width={28} height={7} />
        </div>

        <div className="border-stroke-soft mt-6 flex items-center justify-between border-t pt-4">
          <p className="text-text-soft text-xs">© {new Date().getFullYear()} Trace. All rights reserved.</p>
          <p className="text-text-soft text-[11px]">
            powered by <span className="text-brand-700 font-bold">모두의주차장</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
