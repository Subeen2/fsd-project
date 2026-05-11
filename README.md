# FSD Project

풀스택 모노레포 보일러플레이트. Next.js 15 + Express + 공유 디자인 시스템으로 구성된 프로덕션 수준의 시작점입니다.

---

## 구조

```
root
├── apps
│   ├── web           # Next.js 15 (App Router)   :3000
│   ├── server        # Express + WebSocket        :3001
│   └── storybook     # UI 컴포넌트 문서            :6006
│
├── packages
│   ├── ui            # 디자인 시스템 (Button, Input, Badge, Card, Avatar)
│   ├── shared        # 공통 타입 + 유틸 (cn, formatDate, slugify…)
│   ├── api           # REST 계약 타입 + WebSocket 이벤트 타입
│   ├── features      # 공유 비즈니스 로직 (훅, 서비스)
│   └── config        # ESLint / tsconfig 프리셋
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 빠른 시작

```bash
# 의존성 설치
pnpm install

# 전체 개발 서버 (web + server + storybook 동시 실행)
pnpm dev

# 특정 앱만 실행
pnpm --filter @fsd/web dev
pnpm --filter @fsd/server dev
pnpm --filter @fsd/storybook dev

# 전체 빌드 / 타입 체크 / 린트
pnpm build
pnpm typecheck
pnpm lint
```

| 앱 | 주소 |
|---|---|
| Web | http://localhost:3000 |
| API | http://localhost:3001 |
| WebSocket | ws://localhost:3001/ws |
| Storybook | http://localhost:6006 |

---

## 아키텍처 RFC

> 각 기술 선택의 이유를 기록합니다. "무엇"이 아닌 **왜**에 집중합니다.

---

### 왜 Monorepo (Turborepo + pnpm workspaces)?

**결정**: 단일 레포에서 앱·패키지를 함께 관리.

**이유**:

- `@fsd/api` 타입 하나를 바꾸면 web, server 양쪽이 즉시 에러를 낸다. 별도 레포라면 배포 타이밍 어긋남으로 런타임까지 버그가 숨는다.
- 디자인 시스템(`@fsd/ui`)을 npm 배포 없이 `workspace:*`로 바로 참조. 개발 사이클에서 publish → install 단계 제거.
- Turborepo는 태스크 의존성 그래프를 기반으로 빌드 순서를 자동 결정하고 변경된 패키지만 재실행한다. CI 시간이 패키지 수가 아니라 실제 변경 범위에 비례한다.

**대안 검토**:

| 방식 | 탈락 이유 |
|---|---|
| 별도 레포 | 타입 계약 동기화 비용, 크로스 레포 PR 추적 어려움 |
| Nx | 설정 복잡도 높음. 이 규모에서 오버킬 |
| Yarn workspaces | pnpm 대비 디스크 사용량, 유령 의존성 문제 |

---

### 왜 RSC (React Server Components)?

**결정**: Next.js 15 App Router 기반, 기본 서버 컴포넌트.

**이유**:

- 데이터 페칭 로직이 서버에 남기 때문에 클라이언트 번들에서 DB 드라이버·환경변수·무거운 파싱 라이브러리가 빠진다.
- 워터폴 없이 컴포넌트 트리 안에서 `async/await`로 직접 데이터 페칭. `useEffect + fetch` 패턴보다 코드가 단순하다.
- 'use client' 경계를 명시적으로 선언하는 구조이므로 클라이언트로 보내는 JS가 무엇인지 의식하게 된다.

**대안 검토**:

| 방식 | 탈락 이유 |
|---|---|
| Pages Router | RSC 불가, getServerSideProps 보일러플레이트 |
| SPA (Vite + React) | 초기 렌더링 속도, SEO 불리 |
| Remix | 좋은 선택지지만 Next.js 생태계·팀 친숙도 우선 |

---

### 왜 WebSocket (ws 라이브러리)?

**결정**: Express HTTP 서버에 `ws`를 붙여 단일 포트에서 HTTP + WS 공존.

**이유**:

- 실시간 기능(알림, 협업, 라이브 피드)은 폴링보다 지연이 낮고 서버 부하가 적다. 연결 하나를 열어두고 서버가 push한다.
- `ws`는 의존성이 없는 경량 라이브러리. Socket.io 대비 프로토콜 추상화 없이 표준 WebSocket API 그대로 쓴다.
- `@fsd/api`에 `WsEvent` discriminated union을 정의해 서버·클라이언트가 같은 타입으로 이벤트를 주고받는다. 이벤트 타입 오타가 컴파일 타임에 잡힌다.
- heartbeat(30초 ping/pong)로 zombie 연결을 자동 제거한다.

**대안 검토**:

| 방식 | 탈락 이유 |
|---|---|
| Socket.io | 자체 프로토콜 레이어, 불필요한 추상화 |
| SSE (Server-Sent Events) | 단방향(서버→클라이언트)만 가능 |
| Long polling | 지연 높음, 연결 오버헤드 |

---

### 왜 Tailwind CSS 4?

**결정**: `@fsd/ui` 컴포넌트와 `apps/web` 모두 Tailwind CSS 4 사용.

**이유**:

- CSS-in-JS 대비 빌드 타임 스타일 추출이므로 런타임 오버헤드가 없다.
- Tailwind 4는 `tailwind.config.js` 없이 CSS 파일 안 `@import "tailwindcss"`만으로 동작한다. 설정 파일 관리 부담이 줄었다.
- `@source` 디렉티브로 `packages/ui/src`를 명시해 모노레포 패키지 클래스도 퍼지 없이 스캔된다.
- 유틸리티 클래스 기반이라 디자인 토큰 변경이 컴포넌트 파일을 건드리지 않아도 CSS 변수 하나로 전파된다.

**대안 검토**:

| 방식 | 탈락 이유 |
|---|---|
| Panda CSS | 타입 안전하고 매력적이지만 Tailwind 생태계 친숙도, 아직 성숙도 부족 |
| styled-components | 런타임 스타일 주입, RSC 비호환 |
| CSS Modules | 네이밍 충돌 없지만 컴포넌트 간 스타일 공유 번거로움 |
| vanilla-extract | 빌드 타임 + 타입 안전하지만 러닝 커브 높음 |

---

### 왜 이 패키지 분리 구조?

**결정**: `ui / shared / api / features / config` 5개 패키지.

**이유**:

```
config (leaf)
  └─ shared
       └─ api
            ├─ ui
            └─ features
                  └─ apps
```

- 단방향 의존성. 순환 참조 없이 어느 레이어든 독립 테스트 가능.
- `@fsd/api`가 REST 경로 상수와 WebSocket 이벤트 타입을 모두 갖는다. 서버·클라이언트가 이 패키지 하나만 보면 계약이 맞는다.
- `@fsd/config`는 tsconfig 3종(base / nextjs / react-library)과 ESLint 3종을 제공한다. 앱마다 중복 설정 없이 `extends` 한 줄.

---

### 왜 TypeScript strict?

**결정**: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` 모두 활성화.

**이유**:

- `noUncheckedIndexedAccess`: `arr[0]`의 타입이 `T | undefined`가 된다. 배열 경계 접근 버그를 런타임 전에 잡는다.
- `exactOptionalPropertyTypes`: `{ a?: string }`에 `{ a: undefined }`를 할당하면 에러. 의도한 absent와 명시적 undefined를 구분한다.
- 초반에 타입을 엄격하게 잡아두면 나중에 느슨하게 완화하기 쉽다. 반대는 고통스럽다.

---

## 기술 스택 요약

| 영역 | 선택 | 버전 |
|---|---|---|
| 패키지 매니저 | pnpm | 9.x |
| 빌드 오케스트레이션 | Turborepo | 2.x |
| 프레임워크 | Next.js (App Router) | 15.x |
| UI 라이브러리 | React | 19.x |
| 서버 | Express + ws | 4.x / 8.x |
| 스타일 | Tailwind CSS | 4.x |
| 언어 | TypeScript (strict) | 5.x |
| UI 문서 | Storybook | 8.x |
| 런타임 | Node.js | ≥ 20 |
