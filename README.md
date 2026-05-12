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

# 전체 테스트 (turbo 병렬 실행)
pnpm test

# 특정 패키지만
pnpm --filter @fsd/shared test
pnpm --filter @fsd/features test
pnpm --filter @fsd/ui test

# watch 모드 (파일 변경 감지)
pnpm --filter @fsd/ui test:watch

# 커버리지 리포트
pnpm --filter @fsd/ui test:coverage
```

| 앱        | 주소                   |
| --------- | ---------------------- |
| Web       | http://localhost:3000  |
| API       | http://localhost:3001  |
| WebSocket | ws://localhost:3001/ws |
| Storybook | http://localhost:6006  |

---

## 아키텍처 RFC

> 각 기술 선택의 이유. "무엇"이 아닌 **왜**에 집중합니다.

---

### 왜 Monorepo (Turborepo + pnpm workspaces)?

**결정**: 단일 레포에서 앱·패키지를 함께 관리.

**이유**:

- `@fsd/api` 타입 하나를 바꾸면 web, server 양쪽이 즉시 에러를 낸다. 별도 레포라면 배포 타이밍 어긋남으로 런타임까지 버그가 숨는다.
- 디자인 시스템(`@fsd/ui`)을 npm 배포 없이 `workspace:*`로 바로 참조. 개발 사이클에서 publish → install 단계 제거.
- Turborepo는 태스크 의존성 그래프를 기반으로 빌드 순서를 자동 결정하고 변경된 패키지만 재실행한다. CI 시간이 패키지 수가 아니라 실제 변경 범위에 비례한다.

**대안 검토**:

| 방식            | 탈락 이유                                         |
| --------------- | ------------------------------------------------- |
| 별도 레포       | 타입 계약 동기화 비용, 크로스 레포 PR 추적 어려움 |
| Nx              | 설정 복잡도 높음. 이 규모에서 오버킬              |
| Yarn workspaces | pnpm 대비 디스크 사용량, 유령 의존성 문제         |

---

### 왜 RSC (React Server Components)?

**결정**: Next.js 15 App Router 기반, 기본 서버 컴포넌트.

**이유**:

- 데이터 페칭 로직이 서버에 남기 때문에 클라이언트 번들에서 DB 드라이버·환경변수·무거운 파싱 라이브러리가 빠진다.
- 워터폴 없이 컴포넌트 트리 안에서 `async/await`로 직접 데이터 페칭. `useEffect + fetch` 패턴보다 코드가 단순하다.
- 'use client' 경계를 명시적으로 선언하는 구조이므로 클라이언트로 보내는 JS가 무엇인지 의식하게 된다.

**대안 검토**:

| 방식               | 탈락 이유                                     |
| ------------------ | --------------------------------------------- |
| Pages Router       | RSC 불가, getServerSideProps 보일러플레이트   |
| SPA (Vite + React) | 초기 렌더링 속도, SEO 불리                    |
| Remix              | 좋은 선택지지만 Next.js 생태계·팀 친숙도 우선 |

---

### 왜 WebSocket (ws 라이브러리)?

**결정**: Express HTTP 서버에 `ws`를 붙여 단일 포트에서 HTTP + WS 공존.

**이유**:

- 실시간 기능(알림, 협업, 라이브 피드)은 폴링보다 지연이 낮고 서버 부하가 적다. 연결 하나를 열어두고 서버가 push한다.
- `ws`는 의존성이 없는 경량 라이브러리. Socket.io 대비 프로토콜 추상화 없이 표준 WebSocket API 그대로 쓴다.
- `@fsd/api`에 `WsEvent` discriminated union을 정의해 서버·클라이언트가 같은 타입으로 이벤트를 주고받는다. 이벤트 타입 오타가 컴파일 타임에 잡힌다.
- heartbeat(30초 ping/pong)로 zombie 연결을 자동 제거한다.

**대안 검토**:

| 방식                     | 탈락 이유                             |
| ------------------------ | ------------------------------------- |
| Socket.io                | 자체 프로토콜 레이어, 불필요한 추상화 |
| SSE (Server-Sent Events) | 단방향(서버→클라이언트)만 가능        |
| Long polling             | 지연 높음, 연결 오버헤드              |

---

### 왜 Tailwind CSS 4 + Panda CSS SVA?

**결정**: 두 도구를 역할에 따라 분리해서 공존.

- `apps/web` 페이지 레이아웃·유틸리티 스타일 → **Tailwind CSS 4**
- `packages/ui` 컴포넌트 레시피 → **Panda CSS SVA**

**Tailwind CSS 4를 선택한 이유**:

- CSS-in-JS 대비 빌드 타임 스타일 추출이므로 런타임 오버헤드가 없다.
- `tailwind.config.js` 없이 CSS 파일 안 `@import "tailwindcss"`만으로 동작한다. 설정 파일 관리 부담이 줄었다.
- `@source` 디렉티브로 `packages/ui/src`를 명시해 모노레포 패키지 클래스도 스캔된다.

**Panda CSS SVA를 컴포넌트 레시피에 선택한 이유**:

- `sva` (Slot Variance Authority)는 컴포넌트를 슬롯 단위(`root`, `leftIcon`, `rightIcon`, `spinner`, `label`)로 쪼개어 각 슬롯에 독립적인 variant 스타일을 부여한다. Tailwind 문자열 클래스 조합으로는 이 수준의 슬롯별 제어가 어렵다.
- variant 정의가 타입으로 추론된다. 잘못된 variant 값은 컴파일 타임에 잡힌다.
- 컴포넌트 스타일이 하나의 `sva()` 선언 안에 집약된다. hover/active/disabled/focus 상태가 variant별로 분산되지 않아 가독성이 높다.
- Panda CSS는 PostCSS 플러그인으로 동작해 Tailwind Vite 플러그인과 충돌 없이 공존한다.

**대안 검토**:

| 방식              | 탈락 이유                                           |
| ----------------- | --------------------------------------------------- |
| Tailwind만 사용   | 슬롯별 variant 스타일 분리가 어렵고 문자열이 길어짐 |
| styled-components | 런타임 스타일 주입, RSC 비호환                      |
| CSS Modules       | 컴포넌트 간 스타일 공유 번거로움                    |
| vanilla-extract   | 빌드 타임 + 타입 안전하지만 SVA 수준 레시피 없음    |

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

### 왜 Zustand?

**결정**: 클라이언트 전역 상태(UI 상태, 인증 정보)를 Zustand로 관리. `@fsd/features`에 위치.

**이유**:

- 보일러플레이트가 없다. 스토어 하나가 `create()` 호출 하나다. Redux처럼 액션·리듀서·셀렉터를 별도로 선언하지 않는다.
- 구독 단위가 세밀하다. `useUiStore((s) => s.sidebarOpen)`처럼 슬라이스 단위로 구독하면 해당 값이 바뀔 때만 리렌더링된다.
- RSC 경계 안에서 `'use client'`를 붙인 컴포넌트에서만 쓴다. 서버 컴포넌트가 스토어에 의존하지 않는 구조가 자연스럽게 유지된다.
- `@fsd/features`에 두면 여러 앱이 같은 스토어 로직을 공유할 수 있다. web 전용 상태가 아닌 비즈니스 상태(인증 등)는 여기서 관리한다.

**대안 검토**:

| 방식          | 탈락 이유                                                  |
| ------------- | ---------------------------------------------------------- |
| Redux Toolkit | 이 규모에서 과하다. 액션 타입·슬라이스·셀렉터 분리 비용    |
| Jotai         | atom 단위 관리는 유연하지만 스토어 전체 구조 파악이 어려움 |
| Context API   | 리렌더링 제어가 어렵다. 큰 상태 트리에서 성능 문제 발생    |
| Valtio        | Proxy 기반 변이 모델이 직관적이나 팀 친숙도 낮음           |

---

### 왜 React Query (TanStack Query)?

**결정**: 서버 상태(API 데이터)는 React Query로 관리. `apps/web/hooks`에 위치.

**이유**:

- 서버 상태와 클라이언트 상태를 분리한다. "서버에서 가져온 데이터"는 본질적으로 캐시이고, 만료·재검증·중복 제거 등의 생명주기가 있다. Zustand에 fetch 결과를 담으면 이 로직을 직접 구현해야 한다.
- `staleTime`, `retry`, `invalidateQueries` 세 가지만 알면 80% 케이스가 해결된다. `useEffect + useState + fetch` 패턴 대비 코드가 절반으로 줄어든다.
- Mutation 후 `invalidateQueries`로 관련 쿼리를 자동 재요청한다. 캐시 무효화 로직을 직접 관리할 필요가 없다.
- Devtools가 브라우저에서 캐시 상태를 실시간으로 보여준다. 데이터 페칭 디버깅 비용이 크게 줄어든다.
- RSC와 역할이 다르다. RSC는 초기 서버 렌더링 데이터 페칭, React Query는 클라이언트 측 인터랙션 후 동적 데이터 페칭을 담당한다. 두 가지는 충돌하지 않고 보완 관계다.

**대안 검토**:

| 방식              | 탈락 이유                                               |
| ----------------- | ------------------------------------------------------- |
| SWR               | 기능셋이 좁다. Mutation, 의존 쿼리, Devtools가 약함     |
| Apollo Client     | GraphQL 전용. REST 서버와 쓰기엔 오버킬                 |
| Zustand에 통합    | 캐시 만료·재검증·중복 요청 방지를 직접 구현해야 함      |
| fetch + useEffect | 로딩·에러 상태, 경쟁 조건, 캐시 무효화를 매번 수동 처리 |

---

### 왜 Vitest?

**결정**: 단위테스트 러너로 Vitest 채택. 패키지별 환경 분리.

- `@fsd/shared` → node 환경 (순수 유틸 함수)
- `@fsd/features` → jsdom + React (Zustand 스토어, 훅)
- `@fsd/ui` → jsdom + React (컴포넌트 렌더링·인터랙션)

**이유**:

- Next.js 15 + TypeScript 조합에서 Jest는 설정이 복잡하다. Vite 기반인 Vitest는 거의 제로 설정으로 동일한 API를 제공한다.
- Jest 호환 API(`describe`, `it`, `expect`, `vi`)를 그대로 쓰므로 나중에 Jest로 전환하거나 혼용해도 마이그레이션 비용이 없다.
- Turbopack과 별개로 동작하기 때문에 Next.js 빌드 파이프라인에 영향을 주지 않는다.
- `@testing-library/react`와 조합하면 사용자 관점의 렌더링·인터랙션 테스트가 가능하다. Storybook이 시각적 확인을 담당한다면, Vitest는 동작 검증을 담당한다.

**Storybook과의 역할 분리**:

| 역할                    | Storybook | Vitest       |
| ----------------------- | --------- | ------------ |
| 시각적 확인             | ✅        | ❌           |
| 자동화된 assertion      | ❌        | ✅           |
| CI 회귀 감지            | 별도 설정 | ✅ 기본 지원 |
| 비즈니스 로직·훅 테스트 | ❌        | ✅           |

**대안 검토**:

| 방식       | 탈락 이유                                             |
| ---------- | ----------------------------------------------------- |
| Jest       | Next.js 15 + Turbopack 조합에서 설정 복잡, 속도 느림  |
| Cypress    | E2E 도구. 단위테스트 목적으로는 무겁고 실행 속도 느림 |
| Playwright | 마찬가지로 E2E 전용. 브라우저 실행 비용 큼            |

---

### 왜 TypeScript strict?

**결정**: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` 모두 활성화.

**이유**:

- `noUncheckedIndexedAccess`: `arr[0]`의 타입이 `T | undefined`가 된다. 배열 경계 접근 버그를 런타임 전에 잡는다.
- `exactOptionalPropertyTypes`: `{ a?: string }`에 `{ a: undefined }`를 할당하면 에러. 의도한 absent와 명시적 undefined를 구분한다.
- 초반에 타입을 엄격하게 잡아두면 나중에 느슨하게 완화하기 쉽다. 반대는 고통스럽다.

---

## 기술 스택 요약

| 영역                | 선택                 | 버전      |
| ------------------- | -------------------- | --------- |
| 패키지 매니저       | pnpm                 | 9.x       |
| 빌드 오케스트레이션 | Turborepo            | 2.x       |
| 프레임워크          | Next.js (App Router) | 15.x      |
| UI 라이브러리       | React                | 19.x      |
| 서버                | Express + ws         | 4.x / 8.x |
| 스타일 (유틸리티)   | Tailwind CSS         | 4.x       |
| 스타일 (컴포넌트)   | Panda CSS SVA        | 1.x       |
| 클라이언트 상태     | Zustand              | 5.x       |
| 서버 상태           | TanStack Query       | 5.x       |
| 언어                | TypeScript (strict)  | 5.x       |
| 단위테스트          | Vitest               | 4.x       |
| UI 문서             | Storybook            | 8.x       |
| 런타임              | Node.js              | ≥ 20      |
