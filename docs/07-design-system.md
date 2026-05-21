# 07. Design System & Handoff 명세

> 출처: `design_handoff_trace/README.md` (모주 본진 결제 + Trace MVP 디자인 핸드오프 패키지).
> 본 문서는 디자인 의도의 **source of truth**. 실제 구현은 Tailwind utility + `globals.css`의 `@theme` 토큰을 사용한다.

---

## 0. 사용 원칙

- 핸드오프의 HTML/JSX/CSS는 **레퍼런스**. 그대로 빌드하지 않는다.
- CSS 변수와 BEM 클래스 이름은 의도 파악용 — 실제 구현은 **Tailwind 클래스**로.
- 토큰은 `globals.css`의 `@theme` 블록에 이미 정의됨.
- prototype 변형 톤(픽셀 아트 / 영수증 강화)을 빠른 시각 적용 시 `src/app/prototype.css`를 layout import에 추가 (현재 적용 상태). 정통 디자인 톤으로 복귀 시 해당 import 제거.

**Fidelity: High** — 픽셀·색·여백·인터랙션 모두 최종 의도.

---

## 1. 화면 명세

### 1.1 `/` Home (Trace 메인)

**섹션 (위 → 아래)**

1. **DEMO strip** — 검정 풀폭 띠. `mono 11px`. `padding: 9px 0`. 데스크탑 좌우 정렬 / 모바일 세로 stack.
2. **Hero** — 좌측 정렬, `padding: 64px 0 48px` (모바일 36 0 32).
   - Eyebrow: `mono 11px uppercase`, 앞에 16×1 헤어라인
   - H1: `clamp(36px, 6vw, 60px)`, weight 700, letter-spacing `-0.03em`, line-height `1.05`. `<em>`은 `--accent` (brand-500)
   - Lede: `17px`, `max-width: 540px`, `--fg-2`
   - Meta strip: `mono 11px`, gap 32px, 숫자 `<b>` = `--fg`
3. **LIVE 활동 티커** — `--bg-2` 배경 + 상하 hairline. 좌 LIVE 라벨(빨간 펄스 닷). 우 무한 가로 스크롤 60s linear. `overflow: hidden` 필수.
4. **지역 chips** — 8개(강남/홍대/성수/잠실/여의도/판교/용산/종로). `radius-pill`, 1px solid `--line`, 활성 = 검은 fill.
5. **이번 주 카드 그리드** — 정렬 탭 HOT/NEW/★. 1열(모바일) / 2열(720+) / 4열(1000+). 카드는 `radius-12`, hover = `--accent` border + `shadow-02` + `translateY(-1px)`.
6. **작동 방식 3단계** — 결제+사용 / 영수증 CTA / 익명 게시. 각 박스 hairline 구분.

→ trace 매핑: [(home)/view/HomeView.tsx](<../src/app/(home)/view/HomeView.tsx>)

### 1.2 `/p/{parkinglotSeq}` Detail

**레이아웃**

- 모바일: 1단 누적
- 데스크탑(980+): 좌 **360px sticky** + 우 main. 사이드 `top: 84px; max-height: calc(100vh - 84px); overflow-y: auto`.

**좌측 사이드 (위→아래)**

1. `PARKING_LOT · SEQ={id}` (mono 10px, accent)
2. H1 `clamp(26px, 4vw, 36px)`
3. 주소 + 좌표 (mono)
4. 가격/면수/운영시간 — 상하 hairline, mono 11px
5. GATE · 설비 (LPR/유인 등)
6. **MiniMap** — 4:3, 39×39 grid line, 가운데 핀(accent), 좌하단 좌표 박스, 우하단 100m scale. 절차적 SVG.
7. 네이버지도/카카오맵 외부 deep link

**우측 main**

1. CTA 배너 ("여기 다녀오셨나요?")
2. 3-셀 통계 그리드 — 평균 별점 / 누적 후기 / 재방문율. `radius-12`, hairline 내부 구분.
3. 자주 언급 키워드 — `--pos-soft/pos`, `--neg-soft/neg` 컬러로 집계. 클릭 필터.
4. 정렬 탭 최신순/별점순 — 활성 = accent underline.
5. 후기 리스트 — `92px 1fr` 그리드(모바일 1fr). 좌 meta(시간·paymentSeq), 우 head(닉+별점) + body + 태그 + foot(도움됨·신고).
6. 더 보기 ghost 버튼.

→ trace 매핑: [p/[id]/view/ParkingDetailView.tsx](../src/app/p/[id]/view/ParkingDetailView.tsx)

### 1.3 `/write?token={jwt}` Write

**레이아웃**

- 모바일: 1단 (컨텍스트 → 폼)
- 데스크탑(980+): `380px | 1fr` 2단. min-height: calc(100vh - 60px).

**좌측 컨텍스트**

- `step 1 of 1 · 후기 작성` (mono uppercase)
- 검증 배너 `--banner--verified`: "주차권 사용 확인됨" + `carHash a7f3…b921 · paymentSeq P38ZK4XQ` (mono)
- 블록 4개 (각 상단 hairline + mono label): 주차장 · 이용시간 · 닉네임 · 결제

**우측 폼**

- 별점(필수) — 30×30, hover scale 1.12, on 색 `--color-star` (#ffa93b). 또는 5단 막대.
- 빠른 태그 (5개 토글, 활성 = 검은 fill)
- 자유 코멘트 (500자, `--bg-2` 배경, focus = accent border + soft ring, `450+` caution 카운터)
- 푸터: 취소(ghost) + 안내문 + **흔적 남기기** (accent fill, lg)
- 하단 mono 10px 주의문 2줄

**Flow**: submit → 800ms 시뮬 → 성공 화면 → 1100ms 후 `/p/{lotId}` 리디렉션

→ trace 매핑: [write/view/WriteView.tsx](../src/app/write/view/WriteView.tsx) (영수증 톤으로 리디자인됨 — handoff 명세의 2단 레이아웃 대신 단일 영수증 카드)

### 1.4 에러 / 빈 상태 (4종)

공통: 가운데 정렬, `max-width: 480px`, 80–100px 상하 패딩

- 상단 mono uppercase 코드 (accent): `TOKEN_EXPIRED · 410` / `ALREADY_WRITTEN · 409` / `NO_TRACES_YET · 200` / `SUBMIT_OK · redirecting…`
- 제목: `32px font-weight 700`
- 본문: `15px --fg-2`
- 액션 2개 (primary + ghost)

→ trace 매핑: [write/view/WriteError.tsx](../src/app/write/view/WriteError.tsx) (reason 분기) + [p/[id]/view/ReviewList.tsx](../src/app/p/[id]/view/ReviewList.tsx) (NO_TRACES_YET empty state)

---

## 2. 토큰

### 2.1 Color

**Neutral**: `#171717` → `#ffffff` 11 step (950/900/800/700/600/500/400/300/200/100/0)

**Brand (Primary Blue · Trace accent)**

- 500 `#0099ff` · 700 `#007acc` · 100 `#cceaff` · 50 `#e6f5ff`

**Accent (Trace 검증/추천 그린)**

- 700 `#15803d` · 500 `#22c55e` · 100 `#dcfce7` · 50 `#f0fdf4`

**Negative**

- 700 `#cc3d3d` · 500 `#ff4c4c` · 100 `#ffe2e2` · 50 `#fff1f1`

**Star**: `#ffa93b`

**Semantic alias (Light)**
| Var | Value |
|---|---|
| `--bg` | neutral-0 |
| `--bg-2` | neutral-100 |
| `--fg` | neutral-950 |
| `--fg-2` | neutral-600 |
| `--fg-3` | neutral-400 |
| `--line` | neutral-200 |
| `--line-2` | neutral-300 |
| `--accent` | brand-500 |

### 2.2 Typography

- Sans: `'Pretendard Variable', 'Pretendard', 'Apple SD Gothic Neo', system-ui, sans-serif`
- Mono: `'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace` — 좌표·해시·시간·식별자에만
- Hero H1: `clamp(36px, 6vw, 60px)`, weight 700, letter-spacing `-0.03em`, line-height `1.05`

### 2.3 Radius

`0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 999(pill)`

| 용도                    | 값     |
| ----------------------- | ------ |
| 칩/태그/닉아바타        | `pill` |
| 버튼/입력/맵링크        | `8`    |
| 카드/배너/맵/통계그리드 | `12`   |
| 좌표 박스 등 미세       | `4`    |

> ✅ trace는 **정통 톤** (이 표대로 다양한 radius) 채택. 픽셀 아트 변종은 채택하지 않음.

### 2.4 Shadow

| Token       | Value                        | 용도        |
| ----------- | ---------------------------- | ----------- |
| `shadow-01` | `0 1px 2px rgba(0,0,0,.05)`  | 잔잔한 깊이 |
| `shadow-02` | `0 4px 12px rgba(0,0,0,.06)` | 카드 hover  |
| `shadow-03` | `0 8px 24px rgba(0,0,0,.08)` | 모달/시트   |

**기본 상태에는 그림자 없음.** Hairline (`--line` 1px)으로 구조.

### 2.5 Spacing

| 항목               | 값                            |
| ------------------ | ----------------------------- |
| 컨테이너 패딩      | 데스크탑 24px / 모바일 16px   |
| 컨테이너 max-width | 1200px (모바일 강제뷰 420px)  |
| 섹션 상하 패딩     | 44px (Hero 64–48 / 모바일 36) |
| 카드 내부 패딩     | 18px                          |
| 폼 그룹 간격       | 32px                          |
| 헤더 높이          | 60px sticky top: 0            |

---

## 3. 컴포넌트 명세

| 컴포넌트     | trace 위치                                                                      | Props                                              |
| ------------ | ------------------------------------------------------------------------------- | -------------------------------------------------- |
| `Header`     | [AppHeader.tsx](../src/shared/components/layout/AppHeader.tsx)                  | showSearch                                         |
| `Search`     | [SearchAutocomplete.tsx](../src/shared/components/ui/SearchAutocomplete.tsx)    | compact, autoFocus, onSubmit                       |
| `StarRating` | [StarRating.tsx](../src/shared/components/ui/StarRating.tsx)                    | value, onChange?, size, mode                       |
| `Tag`        | [Tag.tsx](../src/shared/components/ui/Tag.tsx)                                  | tag, count?, active?, asToggle?                    |
| `NickAvatar` | [NickAvatar.tsx](../src/shared/components/ui/NickAvatar.tsx)                    | nickname, style('initial'/'mono'/'dot'), showName? |
| `LotCard`    | [LotCardEditorial.tsx](<../src/app/(home)/view/editorial/LotCardEditorial.tsx>) | lot, rank                                          |
| `MiniMap`    | [p/[id]/view/MiniMap.tsx](../src/app/p/[id]/view/MiniMap.tsx)                   | name, latitude, longitude                          |
| `StatCell`   | [StatCards.tsx](../src/app/p/[id]/view/StatCards.tsx)                           | stats                                              |
| `ReviewRow`  | [ReviewCard.tsx](../src/app/p/[id]/view/ReviewCard.tsx)                         | review, onReport?                                  |

**StarRating 디테일**

- `mode='star'`: 5개, on `--color-star`, off `--fg-4`
- `mode='bar'`: 5×세그먼트, 18×5px (sm), 48×12px (lg)
- `size='lg'`: hover scale 1.12, 우측 `mono 11px` "N.0 / 5" 라벨
- `onChange` 없으면 read-only

**NickAvatar 3 스타일**

- `initial` (기본): 회색 outline + 동물 첫글자
- `mono`: 검은 fill + 흰 글자
- `dot`: 닉네임 컬러 풀에 따라 채색

---

## 4. 인터랙션 / 상태

### 라우팅 (App Router)

- `/` Home
- `/p/{seq}` Detail (SSR + Schema.org Review JSON-LD)
- `/write?token={jwt}` Write
- 에러는 페이지 내부 분기 (별도 라우트 만들지 않음)

### Home state

- `area: string | null`
- `sort: 'hot' | 'new' | 'rating'`

### Detail state

- `sort: 'new' | 'rating'`
- `tagFilter: string | null`
- 더 보기 = 페이지네이션

### Write flow

- `rating: 0-5` (필수, 0이면 submit 비활성)
- `tags: string[]`, `content: string` (500 cap)
- Submit: 800ms 시뮬 → 성공 화면 → 1100ms 후 `/p/{lotId}` 리디렉션
- token == 'expired' → expired 에러
- token == 'duplicate' → duplicate 에러

### 호버 / 포커스

- 버튼: hover = `neutral-700` fill (primary) / `bg-2` (ghost)
- 카드: hover = accent border + shadow-02 + translateY(-1px)
- 칩/태그(toggle): hover = fg-3 border. 활성 = 검은 fill + 흰 텍스트
- 입력/textarea: focus = accent border + `box-shadow 0 0 0 3px accent-soft`
- 별(interactive): hover scale 1.12

### 반응형

- `< 720px`: 모바일 (1단, padding 16px, 헤더 검색 숨김)
- `720px+`: 태블릿 (그리드 2열, 폼 2단)
- `980px+`: 데스크탑 (사이드 sticky, 통계 3열, 카드 4열은 1000px+)

---

## 5. 닉네임 생성 규칙

- 형식: `{색상}{동물}{1000-9999}`
- 색상 풀 (10): `초록 / 파란 / 빨간 / 노란 / 검은 / 하얀 / 보라 / 회색 / 갈색 / 분홍`
- 동물 풀 (20): `자동차 / 호랑이 / 여우 / 사슴 / 토끼 / 다람쥐 / 너구리 / 늑대 / 곰 / 사자 / 코끼리 / 기린 / 펭귄 / 부엉이 / 까마귀 / 매 / 독수리 / 거북이 / 고래 / 돌고래`
- 차량번호 해시당 1개 영구 고정. 충돌 시 재생성.
- 합계 1,800,000 조합

→ 구현: [shared/lib/nickname.ts](../src/shared/lib/nickname.ts) (`generateNickname`, `parseNickname`, `NICK_COLOR_HEX`)

---

## 6. 빠른 태그 (집계 컬러 규칙)

| 태그       | 카테고리 | 표시                        |
| ---------- | -------- | --------------------------- |
| 안내좋음   | 긍정     | `--pos-soft` bg, `--pos` fg |
| 저렴       | 긍정     | 동상                        |
| 좁음       | 부정     | `--neg-soft` bg, `--neg` fg |
| 게이트느림 | 부정     | 동상                        |
| 만차자주   | 부정     | 동상                        |

→ 구현: [shared/lib/tags.ts](../src/shared/lib/tags.ts)

---

## 7. 어셋

- 폰트: Pretendard Variable + IBM Plex Mono
- 아이콘: inline SVG (외부 라이브러리 없음)
- 이미지: 미니맵은 SVG 절차 생성
- 목 데이터: [shared/mocks/](../src/shared/mocks/) (주차장 12곳, 닉네임 풀, 후기 본문 풀)

---

## 8. 핸드오프 원본

원본 패키지: `~/Downloads/Trace/design_handoff_trace/`

- `README.md` (이 문서의 원본)
- `Trace Prototype.html` — 브라우저 실행용 진입점
- `styles.css` — 토큰 + 컴포넌트 스타일 (정통)
- `data.js` — 목 데이터 + 닉네임 로직
- `components.jsx` / `pages.jsx` / `app.jsx` — 레퍼런스 컴포넌트

> ⚠️ `tweaks-panel.jsx`는 디자인 검토용. 프로덕션 빌드엔 포함하지 않는다.

---

## 9. 톤 결정 — 정통 채택

핸드오프엔 두 가지 styles.css가 있었다:

| 톤                             | 위치                                     | 시그니처                                               | 채택 |
| ------------------------------ | ---------------------------------------- | ------------------------------------------------------ | ---- |
| **정통** (handoff README 의도) | `design_handoff_trace/styles.css` (26KB) | `radius 4/8/12/pill 다양`, `shadow soft (0 1px 2px..)` | ✅   |
| 픽셀 변종                      | `~/Downloads/styles.css` (65KB)          | `radius 0 일괄`, `shadow 2px 2px 0 fg` (하드)          | ❌   |

trace는 **정통 톤 채택**. globals.css `@theme` 토큰을 Tailwind utility로 사용한다. 별도 prototype.css import 없음.

영수증 메타포(`.lot-receipt`, `.write-receipt`, `.receipt__*`)는 trace의 의도적 진화로 유지 — globals.css에 정통 톤(soft shadow, 1px border)으로 정의됨.
