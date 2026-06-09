# FSD Project — Claude Instructions

## Project Structure

Turborepo monorepo (pnpm workspaces):

```
apps/
  web/        — Next.js 15 앱 (@fsd/web)
  storybook/  — Storybook 8 (@fsd/storybook)
packages/
  ui/         — 공유 디자인 시스템 (@fsd/ui)
  features/   — 공유 훅/스토어 (@fsd/features)
  shared/     — 유틸리티 (@fsd/shared)
  api/        — API 타입 (@fsd/api)
```

## Design System

### 핵심 원칙

- **토큰 단일 출처**: `packages/ui/src/design-tokens.ts` — 색상·타이포·간격·그림자 모두 여기서 정의
- **컴포넌트 스타일**: Panda CSS `sva()` (슬롯 있음) 또는 `cva()` (단일 루트) 사용
- **하드코딩 금지**: 컴포넌트에서 `gray.400`, `#4f46e5` 같은 primitive 값 직접 사용 금지. 반드시 semantic token 사용
- **예외**: hover/active 전용 음영(rose.600/700), 그라디언트 accent(violet.500) 등 semantic 의미가 없는 시각적 효과는 primitive 유지

### Semantic Token 구조 (`design-tokens.ts`)

```
colors:
  bg.*        — bg.default / bg.subtle / bg.muted / bg.inverted
  text.*      — text.default / text.subtle / text.muted / text.inverted / text.disabled
  border.*    — border.default / border.subtle / border.strong
  brand.*     — brand.default / brand.subtle / brand.muted / brand.fg / brand.text / brand.border
  danger.*    — danger.default / danger.subtle / danger.muted / danger.fg / danger.text / danger.border
  success.*   — success.default / success.subtle / success.muted / success.fg / success.text / success.border
  warning.*   — warning.default / warning.subtle / warning.muted / warning.fg / warning.text / warning.border
  info.*      — info.default / info.subtle / info.muted / info.fg / info.text / info.border

tokens:
  fonts       — sans / serif / mono
  fontSizes   — 2xs / xs / sm / md / lg / xl / 2xl / 3xl / 4xl / 5xl / 6xl
  fontWeights — normal / medium / semibold / bold / extrabold
  lineHeights — none / tight / snug / normal / relaxed / loose
  radii       — none / xs / sm / md / lg / xl / 2xl / 3xl / full
  shadows     — xs / sm / md / lg / xl / 2xl / inner / none
  zIndex      — hide / base / raised / dropdown / sticky / overlay / modal / popover / toast / tooltip
```

### Primitive → Semantic 매핑 치트시트

| Primitive                    | Semantic Token                          |
| ---------------------------- | --------------------------------------- |
| `white` (브랜드 버튼 텍스트) | `brand.fg`                              |
| `white` (위험 버튼 텍스트)   | `danger.fg`                             |
| `indigo.600`                 | `brand.default`                         |
| `indigo.50`                  | `brand.subtle`                          |
| `indigo.100`                 | `brand.muted`                           |
| `indigo.200`                 | `brand.border`                          |
| `indigo.700`                 | `brand.text`                            |
| `slate.50 / gray.50`         | `bg.subtle`                             |
| `slate.100 / gray.100`       | `bg.muted`                              |
| `slate.200 / gray.200`       | `border.default` (배경) 또는 `bg.muted` |
| `slate.300 / gray.300`       | `text.disabled` 또는 `border.default`   |
| `slate.400 / gray.400`       | `text.muted`                            |
| `slate.500 / gray.500`       | `text.muted`                            |
| `slate.600 / gray.600`       | `text.subtle`                           |
| `slate.900 / gray.900`       | `text.default`                          |
| `rose.500 / red.500`         | `danger.default`                        |
| `emerald.500 / green.500`    | `success.default`                       |
| `amber.500 / yellow.500`     | `warning.default`                       |
| `sky.500 / blue.500`         | `info.default`                          |

### 새 토큰 추가 방법

1. `packages/ui/src/design-tokens.ts` 수정
2. 세 곳 모두 codegen 재실행:
   ```bash
   pnpm --filter @fsd/ui run panda
   cd apps/storybook && pnpm exec panda codegen
   cd apps/web && pnpm exec panda codegen
   ```

### 새 컴포넌트 추가 방법

```bash
# 1. 컴포넌트 파일 생성
packages/ui/src/components/<Name>/<Name>.tsx
packages/ui/src/components/<Name>/index.ts  # export * from "./<Name>";

# 2. 컴포넌트 인덱스에 등록
packages/ui/src/components/index.ts  # export * from "./<Name>";

# 3. sva() 사용 예시
import { sva } from "../../../styled-system/css";

const mySlots = sva({
  slots: ["root", ...],
  base: { root: { bg: "bg.default", color: "text.default" } },
  variants: { variant: { primary: { root: { bg: "brand.default", color: "brand.fg" } } } },
  defaultVariants: { variant: "primary" },
});
```

### Storybook 확인

```bash
pnpm --filter @fsd/storybook dev
# http://localhost:6006 (또는 6007)
# Foundations/Design Tokens — 모든 토큰 시각적 레퍼런스
```

## Electron Desktop (`apps/desktop`)

### 구조

```
apps/desktop/
  src/
    main/index.ts      — 메인 프로세스 (BrowserWindow, IPC 핸들러, 앱 메뉴)
    preload/index.ts   — contextBridge로 렌더러에 안전한 API 노출
    preload/index.d.ts — window.electronAPI 타입 선언
  electron.vite.config.ts
  electron-builder.yml
```

### 실행

```bash
# Next.js + Electron 동시 실행 (권장)
pnpm dev:desktop

# Electron만 빌드
pnpm --filter @fsd/desktop build

# 패키징 (배포용)
pnpm --filter @fsd/desktop dist
```

### 동작 방식

| 모드 | 로드 경로                                          |
| ---- | -------------------------------------------------- |
| dev  | `http://localhost:3000` (Next.js 개발 서버)        |
| prod | `resources/web/index.html` (Next.js static export) |

### 노출된 IPC API (`window.electronAPI`)

```ts
getVersion()            // 앱 버전
getPlatform()           // OS 플랫폼
isDev()                 // 개발 모드 여부
getTheme() / setTheme() // 시스템 다크모드 연동
openFile(filters?)      // 네이티브 파일 열기 다이얼로그
saveFile(defaultName?)  // 네이티브 파일 저장 다이얼로그
openExternal(url)       // 시스템 브라우저로 URL 열기
minimize/maximize/close // 커스텀 타이틀바용 윈도우 컨트롤
```

### 프로덕션 빌드 준비

Next.js static export 설정 필요:

```ts
// apps/web/next.config.ts
export default { output: "export" };
```

## Next.js 최적화 규칙

### 이미지: `next/image` 기본 원칙

**항상 `next/image`를 사용한다.** `<img>` 태그는 아래 예외 외에 사용 금지.

```tsx
// 금지
<img src={url} alt="..." />

// 권장
import Image from "next/image";
<Image src={url} alt="..." width={400} height={300} />

// 크기를 모를 때 (부모 relative 필요)
<div style={{ position: "relative", width: "100%" }}>
  <Image src={url} alt="..." fill style={{ objectFit: "contain" }} />
</div>
```

**`next/image` 예외 (eslint-disable 주석 추가):**

- `html2canvas` 렌더 컨테이너 내부 이미지 — `/next/image` 최적화 URL로 바뀌면 CORS 오류 발생
- `data:` URL (Base64 인코딩 이미지) — next/image가 지원하지 않음
- React Flow 노드 내부의 사용자 업로드 이미지 (blob/data URL)

예외 처리 방법:

```tsx
{
  /* eslint-disable-next-line @next/next/no-img-element */
}
<img src={blobUrl} alt="" />;
```

**외부 도메인 이미지를 `next/image`로 사용할 때** `next.config.ts`에 `remotePatterns` 추가:

```ts
images: {
  remotePatterns: [{ protocol: "https", hostname: "example.com" }],
}
```

### 번들 최적화

- 무거운 라이브러리(`three.js`, `@xyflow/react`, `lottie` 등)는 반드시 `next/dynamic`으로 lazy load
- PDF/Canvas 라이브러리(`jspdf`, `html2canvas`)는 사용 시점에 `await import()` 동적 로드
- 번들 확인: `pnpm --filter @fsd/web analyze` → `.next/analyze/client.html` 열기

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Panda CSS v1 (utility-first, CSS-in-JS zero-runtime)
- **State**: Zustand
- **Data Fetching**: TanStack Query v5
- **DB ORM**: Prisma
- **Auth**: JWT (jsonwebtoken)
- **Testing**: Vitest + Testing Library
- **Component Dev**: Storybook 8

## Common Commands

```bash
# 개발 서버
pnpm --filter @fsd/web dev

# Storybook
pnpm --filter @fsd/storybook dev

# 전체 테스트
pnpm --filter @fsd/ui test

# 타입 체크
pnpm --filter @fsd/ui typecheck
pnpm --filter @fsd/web typecheck

# Panda CSS codegen (토큰/컴포넌트 변경 후)
pnpm --filter @fsd/ui run panda
```

## Git

- 기본 브랜치: `main`
- 작업 브랜치: `feat`
- 커밋 전 lint + typecheck 자동 실행 (pre-commit hook)
