# FSD Project

풀스택 모노레포 보일러플레이트. Next.js 15 + WebSocket + 공유 디자인 시스템으로 구성된 프로덕션 수준의 시작점입니다.

---

## 구조

```
root
├── apps
│   ├── web           # Next.js 15 (App Router + API Route Handlers)   :3000
│   ├── ws            # WebSocket 서버 (ws + Prisma)                   :3002
│   └── storybook     # UI 컴포넌트 문서                                :6006
│
├── packages
│   ├── ui            # 디자인 시스템 (Button, Input, Badge, Card, Avatar)
│   ├── shared        # 공통 타입 + 유틸 (cn, formatDate, slugify…)
│   ├── api           # REST 계약 타입 + WebSocket 이벤트 타입
│   ├── features      # 공유 비즈니스 로직 (훅, 서비스)
│   └── config        # ESLint / tsconfig 프리셋
│
├── Dockerfile.ws     # WS 서버 Docker 이미지
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 빠른 시작

### 환경 변수 설정

**`apps/web/.env.local`**

```env
DATABASE_URL=postgresql://...?pgbouncer=true   # Supabase 연결 풀러 (포트 6543)
DIRECT_URL=postgresql://...                     # Supabase 직접 연결 (포트 5432, 마이그레이션용)
JWT_SECRET=your-secret-key
NEXT_PUBLIC_WS_URL=ws://localhost:3002/ws
```

**`apps/ws/.env`**

```env
DATABASE_URL=postgresql://...?pgbouncer=true
JWT_SECRET=your-secret-key                      # web과 동일한 값 필수
```

### 개발 서버 실행

```bash
# 의존성 설치
pnpm install

# Panda CSS 코드 생성 (최초 1회 또는 panda.config.ts 변경 시)
pnpm --filter @fsd/ui panda

# 전체 개발 서버 (web + ws + storybook 동시 실행)
pnpm dev

# 특정 앱만 실행
pnpm --filter @fsd/web dev
pnpm --filter @fsd/ws dev
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
```

| 앱        | 주소                         |
| --------- | ---------------------------- |
| Web       | http://localhost:3000        |
| API       | http://localhost:3000/api/v1 |
| WebSocket | ws://localhost:3002/ws       |
| Storybook | http://localhost:6006        |

---

## 배포

| 앱        | 플랫폼   | URL                                       |
| --------- | -------- | ----------------------------------------- |
| Web + API | Vercel   | https://fsd-project-server-eta.vercel.app |
| WebSocket | Fly.io   | wss://fsd-ws.fly.dev/ws                   |
| Database  | Supabase | PostgreSQL (연결 풀러 포트 6543)          |

### WS 서버 배포 (Fly.io)

```bash
# 루트에서 실행
fly deploy --config apps/ws/fly.toml --dockerfile Dockerfile.ws

# 환경 변수 설정
fly secrets set DATABASE_URL=... JWT_SECRET=... CORS_ORIGIN=... --app fsd-ws
```

---

## 아키텍처 RFC

> 각 기술 선택의 이유. "무엇"이 아닌 **왜**에 집중합니다.

---

### 왜 Monorepo (Turborepo + pnpm workspaces)?

**결정**: 단일 레포에서 앱·패키지를 함께 관리.

**이유**:

- `@fsd/api` 타입 하나를 바꾸면 web, ws 양쪽이 즉시 에러를 낸다. 별도 레포라면 배포 타이밍 어긋남으로 런타임까지 버그가 숨는다.
- 디자인 시스템(`@fsd/ui`)을 npm 배포 없이 `workspace:*`로 바로 참조. 개발 사이클에서 publish → install 단계 제거.
- Turborepo는 태스크 의존성 그래프를 기반으로 빌드 순서를 자동 결정하고 변경된 패키지만 재실행한다. CI 시간이 패키지 수가 아니라 실제 변경 범위에 비례한다.

**대안 검토**:

| 방식            | 탈락 이유                                         |
| --------------- | ------------------------------------------------- |
| 별도 레포       | 타입 계약 동기화 비용, 크로스 레포 PR 추적 어려움 |
| Nx              | 설정 복잡도 높음. 이 규모에서 오버킬              |
| Yarn workspaces | pnpm 대비 디스크 사용량, 유령 의존성 문제         |

---

### 왜 Next.js Route Handlers로 REST API를 통합했나?

**결정**: 별도 Express 서버 대신 `apps/web/app/api/v1/**` Route Handlers로 REST API 제공.

**이유**:

- 프론트엔드와 API가 같은 도메인을 공유하므로 CORS 설정이 불필요하다. Vercel 배포 시 별도 서버를 띄우지 않아도 된다.
- Vercel Serverless Functions으로 자동 배포. 트래픽에 따라 스케일 아웃·인이 자동으로 이루어진다.
- Next.js 미들웨어, 인증, 타입 공유가 동일한 코드베이스에서 이루어진다.

**대안 검토**:

| 방식              | 탈락 이유                                         |
| ----------------- | ------------------------------------------------- |
| Express 별도 서버 | CORS 필요, 별도 배포 플랫폼 관리 비용             |
| tRPC              | 좋은 선택이지만 REST 타입 계약(`@fsd/api`)과 중복 |

---

### 왜 WebSocket 서버를 분리했나? (apps/ws)

**결정**: WebSocket 서버를 `apps/ws`로 분리하고 Fly.io에 상시 실행 컨테이너로 배포.

**이유**:

- Vercel Serverless는 요청당 실행 후 종료되는 구조라 WebSocket 같은 지속 연결을 유지할 수 없다.
- `apps/ws`는 HTTP 서버 + WebSocket 서버를 하나의 프로세스로 실행. Fly.io는 장기 실행 컨테이너를 지원한다.
- `@fsd/api`의 `WsEvent` discriminated union을 web과 ws가 공유해 이벤트 타입 불일치를 컴파일 타임에 잡는다.
- heartbeat(30초 ping/pong)로 zombie 연결을 자동 제거한다.

**대안 검토**:

| 방식                     | 탈락 이유                             |
| ------------------------ | ------------------------------------- |
| Socket.io                | 자체 프로토콜 레이어, 불필요한 추상화 |
| SSE (Server-Sent Events) | 단방향(서버→클라이언트)만 가능        |
| Vercel WebSocket         | 유료 플랜 필요                        |

---

### 왜 Supabase PostgreSQL + Prisma?

**결정**: DB는 Supabase(PostgreSQL), ORM은 Prisma. Serverless 환경에서는 PgBouncer 연결 풀러(포트 6543) 사용.

**이유**:

- Supabase는 PostgreSQL을 관리형으로 제공. 연결 풀러(PgBouncer)가 내장되어 있어 Serverless 함수의 짧은 연결 폭발을 DB가 견딜 수 있다.
- `DATABASE_URL`에 `?pgbouncer=true`를 붙이면 Prisma가 prepared statement를 비활성화해 풀러와 호환된다.
- Prisma는 스키마를 단일 진실 공급원으로 삼아 DB 마이그레이션과 타입 생성을 모두 처리한다.
- `directUrl`(포트 5432)은 마이그레이션 전용. 런타임 쿼리는 항상 풀러를 통한다.

**대안 검토**:

| 방식        | 탈락 이유                                           |
| ----------- | --------------------------------------------------- |
| Drizzle ORM | 좋은 선택이지만 Prisma 대비 생태계·문서 성숙도 낮음 |
| Neon        | 유사한 서비스. Supabase가 대시보드·Auth 통합 용이   |
| MongoDB     | 관계형 데이터(User↔Message)에 RDBMS가 자연스럽다    |

---

### 왜 JWT 인증?

**결정**: 회원가입/로그인 API에서 JWT를 발급. WS 서버에서 동일한 `JWT_SECRET`으로 검증.

**이유**:

- Vercel API와 Fly.io WS 서버가 분리된 환경에서 세션 저장소 없이 상태 없는(stateless) 인증이 가능하다.
- WebSocket 연결 시 `chat:join` 이벤트 페이로드에 토큰을 포함해 전송. 연결 헤더로 토큰을 전달하기 어려운 브라우저 WS 제약을 우회한다.
- 두 서버가 같은 `JWT_SECRET`을 공유하는 것이 필수 조건이다.

---

### 왜 RSC (React Server Components)?

**결정**: Next.js 15 App Router 기반, 기본 서버 컴포넌트.

**이유**:

- 데이터 페칭 로직이 서버에 남기 때문에 클라이언트 번들에서 DB 드라이버·환경변수·무거운 파싱 라이브러리가 빠진다.
- 워터폴 없이 컴포넌트 트리 안에서 `async/await`로 직접 데이터 페칭. `useEffect + fetch` 패턴보다 코드가 단순하다.
- `'use client'` 경계를 명시적으로 선언하는 구조이므로 클라이언트로 보내는 JS가 무엇인지 의식하게 된다.

**대안 검토**:

| 방식               | 탈락 이유                                     |
| ------------------ | --------------------------------------------- |
| Pages Router       | RSC 불가, getServerSideProps 보일러플레이트   |
| SPA (Vite + React) | 초기 렌더링 속도, SEO 불리                    |
| Remix              | 좋은 선택지지만 Next.js 생태계·팀 친숙도 우선 |

---

### 왜 Panda CSS?

**결정**: 앱·컴포넌트 스타일 전체를 Panda CSS로 통일.

- `apps/web` 페이지 레이아웃·유틸리티 스타일 → **`css()` 유틸리티**
- `packages/ui` 컴포넌트 레시피 → **`sva()` (Slot Variance Authority)**

**이유**:

- `sva`는 컴포넌트를 슬롯 단위(`root`, `leftIcon`, `rightIcon`, `spinner`, `label`)로 쪼개어 각 슬롯에 독립적인 variant 스타일을 부여한다.
- variant 정의가 타입으로 추론된다. 잘못된 variant 값은 컴파일 타임에 잡힌다.
- PostCSS 플러그인으로 동작하므로 런타임 오버헤드가 없다. 빌드 타임에 CSS를 추출한다.

**대안 검토**:

| 방식              | 탈락 이유                                           |
| ----------------- | --------------------------------------------------- |
| Tailwind CSS      | 슬롯별 variant 스타일 분리가 어렵고 문자열이 길어짐 |
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
                  └─ apps (web, ws)
```

- 단방향 의존성. 순환 참조 없이 어느 레이어든 독립 테스트 가능.
- `@fsd/api`가 REST 경로 상수와 WebSocket 이벤트 타입을 모두 갖는다. web·ws 양쪽이 이 패키지 하나만 보면 계약이 맞는다.
- `@fsd/config`는 tsconfig 3종(base / nextjs / react-library)과 ESLint 3종을 제공한다.

---

### 왜 Vitest?

**결정**: 단위테스트 러너로 Vitest 채택. 패키지별 환경 분리.

- `@fsd/shared` → node 환경 (순수 유틸 함수)
- `@fsd/features` → jsdom + React (훅)
- `@fsd/ui` → jsdom + React (컴포넌트)

**이유**:

- Next.js 15 + TypeScript 조합에서 Jest는 설정이 복잡하다. Vite 기반인 Vitest는 거의 제로 설정으로 동일한 API를 제공한다.
- Jest 호환 API(`describe`, `it`, `expect`, `vi`)를 그대로 쓰므로 나중에 Jest로 전환해도 마이그레이션 비용이 없다.

---

### 왜 TypeScript strict?

**결정**: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` 모두 활성화.

**이유**:

- `noUncheckedIndexedAccess`: `arr[0]`의 타입이 `T | undefined`가 된다. 배열 경계 접근 버그를 런타임 전에 잡는다.
- `exactOptionalPropertyTypes`: `{ a?: string }`에 `{ a: undefined }`를 할당하면 에러.
- 초반에 타입을 엄격하게 잡아두면 나중에 느슨하게 완화하기 쉽다. 반대는 고통스럽다.

---

## 기술 스택 요약

| 영역                | 선택                          | 버전 |
| ------------------- | ----------------------------- | ---- |
| 패키지 매니저       | pnpm                          | 9.x  |
| 빌드 오케스트레이션 | Turborepo                     | 2.x  |
| 프레임워크          | Next.js (App Router)          | 15.x |
| UI 라이브러리       | React                         | 19.x |
| WebSocket 서버      | ws                            | 8.x  |
| 스타일              | Panda CSS (css + SVA)         | 1.x  |
| 클라이언트 상태     | Zustand                       | 5.x  |
| 서버 상태           | TanStack Query                | 5.x  |
| 데이터베이스        | PostgreSQL (Supabase)         | -    |
| ORM                 | Prisma                        | 5.x  |
| 인증                | JWT (jsonwebtoken + bcryptjs) | -    |
| 언어                | TypeScript (strict)           | 5.x  |
| 단위테스트          | Vitest                        | 4.x  |
| UI 문서             | Storybook                     | 8.x  |
| 런타임              | Node.js                       | ≥ 20 |
| 배포 (Web + API)    | Vercel                        | -    |
| 배포 (WebSocket)    | Fly.io                        | -    |
