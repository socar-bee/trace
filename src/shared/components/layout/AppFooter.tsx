import { APP_DESCRIPTION, APP_NAME } from '@/shared/lib/constants'

export default function AppFooter() {
  return (
    <footer className="border-stroke-soft mt-16 border-t">
      <div className="text-text-soft mx-auto max-w-[1200px] px-4 py-10 text-sm md:px-6">
        <div className="flex flex-col gap-1">
          <span className="text-text-strong text-base font-bold">{APP_NAME}</span>
          <span className="text-xs">{APP_DESCRIPTION}</span>
        </div>
        <p className="text-text-disabled mt-6 text-xs">© {new Date().getFullYear()} Trace. All rights reserved.</p>
      </div>
    </footer>
  )
}
