import { NextResponse, type NextRequest } from 'next/server'

const FROM_APP_COOKIE = 'tr_from_app'
const FROM_APP_PARAM = 'from'

// Why: 네이티브 앱 webview 진입 시 ?from=app 를 한 번만 쿠키로 박제해서
//      이후 라우팅·새로고침에도 풀스크린 모드(=DockBar 숨김)를 유지한다.
export function middleware(req: NextRequest) {
  const url = req.nextUrl
  if (url.searchParams.get(FROM_APP_PARAM) !== 'app') return NextResponse.next()

  const clean = url.clone()
  clean.searchParams.delete(FROM_APP_PARAM)
  const res = NextResponse.redirect(clean)
  res.cookies.set(FROM_APP_COOKIE, '1', {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  })
  return res
}

export const config = {
  matcher: ['/((?!_next|api|icons|images|favicon.ico|robots.txt|sitemap.xml).*)']
}
