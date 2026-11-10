# React Starter Kit

Vite, React, TypeScript, Tailwind CSS v4 기반의 프론트엔드 스타터 킷입니다.
라우팅, 상태 관리, 서버 상태, 폼 검증, 테스트, 린트/포맷 설정이 기본으로 구성되어 있습니다.

## 기술 스택

| 영역            | 라이브러리                         | 버전                  |
| --------------- | ---------------------------------- | --------------------- |
| 빌드            | Vite                               | 8.3.7                 |
| UI              | React / React DOM                  | 19.3.1                |
| 언어            | TypeScript                         | 6.0.3                 |
| 스타일          | Tailwind CSS (`@tailwindcss/vite`) | 4.3.5                 |
| UI 컴포넌트     | shadcn/ui (CLI) / Base UI          | 4.23.0 / 1.9.0        |
| 아이콘          | lucide-react                       | 1.70.0                |
| 알림(토스트)    | Sonner                             | 2.0.8                 |
| 클래스 유틸     | clsx / tailwind-merge / cva        | 2.1.1 / 3.7.0 / 0.7.1 |
| 라우팅          | React Router                       | 8.5.1                 |
| 클라이언트 상태 | Zustand                            | 5.1.0                 |
| 서버 상태       | TanStack Query / Axios             | 5.107.1 / 1.21.1      |
| 폼 / 검증       | React Hook Form / Zod              | 7.91.0 / 4.6.7        |
| 테스트          | Vitest / Testing Library           | 5.1.0 / 16.3.3        |
| 린트 / 포맷     | ESLint 10 / Prettier 3.9.10        |                       |

> TypeScript는 `typescript-eslint`가 지원하는 최신 범위(`<6.1.0`)에 맞춰 6.0.3을 사용합니다. 7.x는 현재 린터와 peer 의존성이 충돌합니다.

## 시작하기

```bash
npm install
cp .env.example .env   # 필요 시 값 수정
npm run dev
```

## 스크립트

| 명령어                            | 설명                       |
| --------------------------------- | -------------------------- |
| `npm run dev`                     | 개발 서버 실행             |
| `npm run build`                   | 타입 검사 후 프로덕션 빌드 |
| `npm run preview`                 | 빌드 결과 미리보기         |
| `npm run typecheck`               | TypeScript 타입 검사       |
| `npm run lint`                    | ESLint 검사                |
| `npm run format` / `format:check` | Prettier 포맷 / 검사       |
| `npm run test` / `test:watch`     | Vitest 테스트 실행         |

## 프로젝트 구조

```
src/
  app/          # 전역 Provider(providers.tsx), 라우터(router.tsx)
  layouts/      # 공통 레이아웃 (RootLayout)
  pages/        # 페이지 컴포넌트 (lazy 로딩 대상)
  components/   # 공용 컴포넌트 (ErrorMessage, FormField, ProtectedRoute)
  components/ui/ # shadcn/ui 컴포넌트 (button, input, card, sonner ...) - CLI로 추가됨
  stores/       # Zustand 스토어 (themeStore, authStore)
  hooks/        # 서버 상태 훅 (useTodos)
  lib/          # axios 인스턴스, QueryClient, cn 유틸(utils.ts)
  test/         # 테스트 setup 및 예제 테스트
```

`@/` 경로 별칭은 `src/`를 가리킵니다 (`tsconfig.app.json`, `vite.config.ts`).

## 기본 기능 예제

- **라우팅**: 레이아웃 라우트, 중첩 라우트, `lazy` 코드 분할, 404 처리, `/todos`는 `ProtectedRoute`로 보호
- **상태 관리**: `themeStore`(다크 모드, `<html class="dark">` 동기화), `authStore`(로그인 상태) 모두 `persist`로 저장
- **서버 상태**: `useTodos` 훅 (TanStack Query + Axios, JSONPlaceholder API)
- **폼**: 로그인 페이지 (React Hook Form + Zod 검증, shadcn `Card`/`Input`/`Label` 사용)
- **UI**: shadcn/ui 컴포넌트와 lucide-react 아이콘으로 구성, 라이트/다크 테마 토큰 적용
- **테스트**: `src/test/` 예제 테스트 (컴포넌트, 스토어)

## API 연동

백엔드 연결 예제는 GET(목록/단건), POST(생성)와 공통 오류 처리를 포함합니다.

| 파일                              | 역할                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| `src/lib/api.ts`                  | axios 인스턴스, 요청 인터셉터(토큰 부착), 응답 인터셉터(오류 정규화, 401 시 로그아웃) |
| `src/lib/apiError.ts`             | `ApiError` 클래스, `toApiError()` 변환 함수                                           |
| `src/api/posts.ts`                | `getPosts`, `getPost`, `createPost` 요청 함수 (백엔드 스키마에 맞게 수정)             |
| `src/hooks/usePosts.ts`           | `usePosts`, `usePost`(useQuery), `useCreatePost`(useMutation)                         |
| `src/lib/queryClient.ts`          | 4xx는 재시도하지 않음, 전역 오류 토스트                                               |
| `src/components/ErrorMessage.tsx` | 오류 메시지와 "다시 시도" 버튼                                                        |
| `src/components/ui/sonner.tsx`    | Sonner 토스트(성공/오류 알림), 테마는 `themeStore`와 연동                             |

### 오류 코드

| 상황                                    | `code`                                                                  | 기본 메시지                             |
| --------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------- |
| 응답 없음 (오프라인, 서버 미기동, CORS) | `NETWORK_ERROR`                                                         | 네트워크 연결을 확인해 주세요.          |
| 시간 초과                               | `TIMEOUT`                                                               | 요청 시간이 초과되었습니다.             |
| 400 / 401 / 403 / 404 / 409             | `BAD_REQUEST` / `UNAUTHORIZED` / `FORBIDDEN` / `NOT_FOUND` / `CONFLICT` | 상태별 한국어 메시지                    |
| 422                                     | `VALIDATION_ERROR`                                                      | 응답의 `errors` 필드 메시지를 폼에 표시 |
| 5xx                                     | `SERVER_ERROR`                                                          | 서버에 문제가 발생했습니다.             |

서버가 `{ "message": "..." }`를 보내면 기본 메시지 대신 그 문구를 사용합니다.

### 백엔드 연결 방법

1. `.env`에 `VITE_API_BASE_URL=https://내-백엔드주소` 설정 (`.env.example` 참고)
2. `src/api/posts.ts`의 `Post`, `NewPost` 타입과 경로를 백엔드 스펙에 맞게 수정
3. 로그인 응답 토큰을 `authStore.login`에 저장하도록 `src/stores/authStore.ts` 수정 (현재는 `demo-token`)

> `authStore`는 localStorage에 토큰을 저장하는 학습용 예제입니다. 운영 환경에서는 httpOnly 쿠키 사용을 권장합니다.

## UI 컴포넌트 (shadcn/ui + lucide-react)

shadcn/ui는 패키지가 아니라 **소스 코드를 `src/components/ui/`에 복사**하는 방식입니다. 생성된 파일은 자유롭게 수정할 수 있습니다.

- 설정 파일: `components.json` (스타일 `base-nova`, 기본 색상 `neutral`, 별칭 `@/components`, `@/lib/utils` 등)
- 컴포넌트 추가: `npx shadcn@latest add dialog` (다른 컴포넌트 이름으로 교체 가능)
- 컴포넌트 기반: Base UI (`@base-ui/react`). 생성된 컴포넌트가 Base UI를 import하므로 이 패키지를 제거하면 안 됩니다.
- 테마 색상: `src/index.css`의 `:root` / `.dark` 토큰 (`--primary`, `--background` 등). `@theme inline`으로 `bg-primary`, `text-muted-foreground` 같은 유틸리티가 됩니다.
- 아이콘: `import { Plus } from 'lucide-react'` 후 `<Plus />`처럼 사용 (크기는 기본 `size-4` 자동 적용)
- 클래스 합치기: `import { cn } from '@/lib/utils'`
- 알림: `import { toast } from 'sonner'`로 `toast.success('...')` / `toast.error('...')` 호출

## 확장 가이드

- 새 페이지: `src/pages/`에 작성 후 `src/app/router.tsx`에 라우트 추가
- 인증 연동: `src/stores/authStore.ts`의 `login`을 실제 API 호출로 교체
- API 추가: `src/lib/api.ts` 인스턴스를 사용해 `src/hooks/`에 React Query 훅 작성
- 다크 모드: Tailwind `dark:` 변형 사용 (`src/index.css`의 `@custom-variant`)
- 에디터 경고: `src/index.css`에서 `@custom-variant`, `@theme`, `@apply`에 "Unknown at rule" 경고가 뜨면 VS Code 내장 CSS 린터가 Tailwind v4 문법을 모르는 것입니다. `.vscode/settings.json`의 설정이 이를 무시하도록 되어 있으며, 권장 확장 `bradlc.vscode-tailwindcss`(Tailwind CSS IntelliSense) 설치를 권장합니다.
