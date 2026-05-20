# Trace · 주차장 흔적

> 주차권을 사용한 운전자만 글을 쓸 수 있는 익명 주차장 리뷰 플랫폼.
> SOCAR / 모두의주차장 본진과 분리된 별도 웹 자산. 도메인 `trace.modu.kr`.

## Stack

Next.js 16 (App Router · Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · TanStack Query v5 · framer-motion · date-fns · pnpm · Node ^24.12.0.

## Commands

```bash
pnpm install
pnpm dev          # APP_ENV=local, 포트 5173
pnpm build        # type-check + next build
pnpm type-check
pnpm lint
pnpm format
```

커밋 시 husky + lint-staged 가 자동 `eslint --fix` + `prettier --write`. `--no-verify` 사용 금지.

## 라우트

| 경로                  | 설명                                                   |
| --------------------- | ------------------------------------------------------ |
| `/`                   | 메인 — 인기 주차장 + 지역 칩                           |
| `/p/[id]`             | 주차장 상세 (SSR + JSON-LD Review schema)              |
| `/write?token=xxx`    | 흔적 작성 (토큰 검증 / 별점 / 빠른 태그 / 자유 코멘트) |
| `/me/traces`          | 내가 남긴 흔적 (localStorage 기반)                     |
| `/search?q= / ?area=` | 검색 / 지역별                                          |

## 디렉토리 구조 (MVVM)

```
src/app/<route>/
  page.tsx                 # thin shell (SSR / metadata)
  view/<Name>View.tsx      # 클라이언트 뷰
  view/<Subcomponent>.tsx  # 보조 컴포넌트
  (viewmodel/, model/)     # 필요 시
src/shared/
  components/{layout,ui}   # AppHeader, AppFooter, ParkingCard, StarRating, Tag, Logo
  lib/                     # nickname, tags, format, trace-storage, seo, constants
  mocks/                   # 더미 데이터 + mock API (백엔드 붙기 전 임시)
  hooks/, providers/, types/
```

## 백엔드

현재는 [src/shared/mocks/api.ts](./src/shared/mocks/api.ts)에서 더미 데이터를 반환합니다.
실서버 연결 시 이 파일만 실제 fetch 호출로 교체하면 됩니다 (시그니처는 그대로 유지).

| Mock 함수                 | 대응될 백엔드 API                    |
| ------------------------- | ------------------------------------ |
| `fetchPopularParkingLots` | `GET /api/trace/parkinglots/popular` |
| `fetchParkingLotDetail`   | `GET /api/trace/parkinglots/{seq}`   |
| `searchParkingLotsApi`    | `GET /api/trace/search?q=`           |
| `verifyToken`             | `GET /api/trace/verify?token=`       |
| `submitReview`            | `POST /api/trace/reviews`            |

흔적 작성 토큰은 본진 결제 완료 후 `POST /api/trace/token`에서 발급 → 24시간 단기 JWT.

## 데모 진입

백엔드 붙기 전 흔적 작성을 체험하려면 `/write` 진입 후 데모 토큰 클릭:

- `demo-101` 강남역 센터필드
- `demo-201` 홍대입구 와이즈파크
- `demo-401` 잠실 롯데월드몰
- `demo-expired` 만료 토큰 (에러 화면 확인용)

## 환경변수

| 변수                                     | 용도                                         |
| ---------------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_NAVER_STATIC_MAP_CLIENT_ID` | 주차장 상세 정적 미니맵 (없으면 placeholder) |
| `APP_ENV`                                | `local` / `prod` (robots / sitemap 분기)     |

## 라이선스

Private — SOCAR 내부 자산.
