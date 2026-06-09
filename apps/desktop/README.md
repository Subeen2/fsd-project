# Mindwave Desktop

Next.js 웹 앱을 Electron으로 감싼 데스크탑 앱입니다.

## 구조

```
apps/desktop/
├── src/
│   ├── main/
│   │   └── index.ts        메인 프로세스 — BrowserWindow, IPC 핸들러, 앱 메뉴
│   └── preload/
│       ├── index.ts        contextBridge — 렌더러에 안전한 API 노출
│       └── index.d.ts      window.electronAPI 타입 선언
├── resources/              앱 아이콘 (icon.icns / .ico / .png)
├── electron.vite.config.ts main + preload 빌드 설정
├── electron-builder.yml    패키징 설정 (dmg / nsis / AppImage)
├── tsconfig.json
└── package.json
```

## 실행 방법

```bash
# Next.js + Electron 동시 실행 (권장)
pnpm dev:desktop

# Next.js만 실행
pnpm --filter @fsd/web dev

# Electron만 빌드 (out/ 생성)
pnpm --filter @fsd/desktop build

# 배포용 패키징 (release/ 생성)
pnpm --filter @fsd/desktop dist
```

## 아키텍처

### 동작 방식

Electron은 렌더러 없이 **외부 웹앱 URL을 로드**합니다.

| 모드 | 로드 경로                                          |
| ---- | -------------------------------------------------- |
| dev  | `http://localhost:3000` (Next.js 개발 서버)        |
| prod | `resources/web/index.html` (Next.js static export) |

```
[Main Process]          [Preload Script]         [Renderer = Next.js]
  BrowserWindow    ←→   contextBridge       ←→   window.electronAPI.*
  IPC handlers          ipcRenderer              React 컴포넌트
  Native API            보안 경계 역할
```

### 보안 설정

| 옵션               | 값                         | 이유                                |
| ------------------ | -------------------------- | ----------------------------------- |
| `contextIsolation` | `true`                     | 렌더러가 Node.js API 직접 접근 불가 |
| `sandbox`          | `true`                     | 렌더러 프로세스 OS 권한 제한        |
| `webSecurity`      | prod: `true`, dev: `false` | dev에서 localhost CORS 허용         |

### electron-vite 빌드

`renderer` 설정이 **없습니다**. 렌더러는 Next.js가 담당하기 때문입니다.

```ts
// electron.vite.config.ts
export default defineConfig({
  main: { ... },     // src/main/index.ts → out/main/index.js
  preload: { ... },  // src/preload/index.ts → out/preload/index.js
  // renderer 없음 — Next.js URL을 직접 로드
});
```

## IPC API (`window.electronAPI`)

렌더러(Next.js)에서 `window.electronAPI`로 네이티브 기능을 호출합니다.

```ts
// 앱 정보
await window.electronAPI.getVersion(); // "0.0.1"
await window.electronAPI.getPlatform(); // "darwin" | "win32" | "linux"
await window.electronAPI.isDev(); // true | false

// 시스템 테마
await window.electronAPI.getTheme(); // "light" | "dark"
window.electronAPI.setTheme("dark"); // "light" | "dark" | "system"

// 네이티브 파일 다이얼로그
const path = await window.electronAPI.openFile([
  { name: "Images", extensions: ["png", "jpg"] },
]); // 선택한 파일 경로 또는 null

const savePath = await window.electronAPI.saveFile("export.pdf"); // 또는 null

// 외부 브라우저로 URL 열기
window.electronAPI.openExternal("https://example.com");

// 커스텀 타이틀바용 윈도우 컨트롤
window.electronAPI.minimize();
window.electronAPI.maximize(); // 최대화/복원 토글
window.electronAPI.close();
```

### ipcMain ↔ ipcRenderer 채널 목록

| 채널                 | 방향   | 설명                 |
| -------------------- | ------ | -------------------- |
| `app:version`        | invoke | 앱 버전              |
| `app:platform`       | invoke | OS 플랫폼            |
| `app:isDev`          | invoke | 개발 모드 여부       |
| `theme:get`          | invoke | 현재 시스템 테마     |
| `theme:set`          | send   | 테마 변경            |
| `dialog:openFile`    | invoke | 파일 열기 다이얼로그 |
| `dialog:saveFile`    | invoke | 파일 저장 다이얼로그 |
| `shell:openExternal` | send   | 외부 URL 열기        |
| `win:minimize`       | send   | 창 최소화            |
| `win:maximize`       | send   | 창 최대화/복원       |
| `win:close`          | send   | 창 닫기              |

> `invoke`는 응답이 있는 비동기 호출, `send`는 단방향 이벤트입니다.

## 프로덕션 빌드 준비

배포 전 Next.js를 **static export**로 빌드해야 합니다.

**1. `apps/web/next.config.ts`에 export 설정 추가:**

```ts
const nextConfig: NextConfig = {
  output: "export", // ← 추가
  // ...
};
```

**2. 빌드 및 패키징:**

```bash
pnpm --filter @fsd/web build     # apps/web/out/ 생성
pnpm --filter @fsd/desktop dist  # release/ 에 설치 파일 생성
```

electron-builder가 `apps/web/out/`을 `resources/web/`으로 번들링합니다.

### 패키징 결과물

| OS      | 형식                   | 경로                           |
| ------- | ---------------------- | ------------------------------ |
| macOS   | `.dmg` (x64 + arm64)   | `release/Mindwave-*.dmg`       |
| Windows | `.exe` (NSIS 인스톨러) | `release/Mindwave-Setup-*.exe` |
| Linux   | `.AppImage`            | `release/Mindwave-*.AppImage`  |

## 새 IPC 채널 추가하는 법

### 1. 메인 프로세스에 핸들러 등록 (`src/main/index.ts`)

```ts
// invoke: 응답이 필요한 경우
ipcMain.handle("my:channel", async (_e, arg: string) => {
  return doSomething(arg);
});

// on: 단방향 이벤트
ipcMain.on("my:event", (_e, data) => {
  handleEvent(data);
});
```

### 2. Preload에서 렌더러에 노출 (`src/preload/index.ts`)

```ts
const electronAPI = {
  // 기존 메서드들...
  myMethod: (arg: string): Promise<string> =>
    ipcRenderer.invoke("my:channel", arg),
};
```

### 3. 타입 선언 업데이트 (`src/preload/index.d.ts`)

```ts
export interface ElectronAPI {
  // 기존 타입들...
  myMethod(arg: string): Promise<string>;
}
```

### 4. Next.js에서 사용

```ts
// Electron 환경에서만 실행되도록 guard 추가
if (typeof window !== "undefined" && window.electronAPI) {
  const result = await window.electronAPI.myMethod("hello");
}
```
