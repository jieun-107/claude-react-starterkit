---
description: 새 페이지 컴포넌트를 만들고 라우터에 등록한다
argument-hint: <페이지이름> [--protected]
---

새 페이지를 추가한다. 인자: `$ARGUMENTS`

## 입력 처리

1. 인자의 첫 단어를 페이지 이름으로 사용한다. 예: `Settings` → 컴포넌트 `SettingsPage`
2. 이름은 PascalCase여야 한다. 아니면 중단하고 올바른 이름을 요청한다.
3. `--protected` 옵션이 있거나 사용자가 로그인 필요를 명시하면 `ProtectedRoute`로 감싼다.
4. 같은 이름의 파일이 `src/pages/`에 이미 있으면 덮어쓰지 말고 중단한다.

## 작업 순서

1. **참고 파일 읽기**: `src/pages/AboutPage.tsx`와 `src/app/router.tsx`를 먼저 읽고 기존 패턴(export 방식, 레이아웃, 라우트 구조)을 파악한다.
2. **페이지 생성**: `src/pages/<이름>Page.tsx`를 만든다.
   - 기존 페이지와 같은 export 방식과 import 경로(`@/` 별칭)를 따른다.
   - 페이지 제목을 담은 최소한의 마크업만 넣는다.
   - 들여쓰기 2칸, 주석은 한국어로 쓴다.
3. **라우터 등록**: `src/app/router.tsx`의 기존 라우트 배열에 추가한다.
   - `lazy: () => import("@/pages/<이름>Page")` 형태를 쓴다. 기존 항목의 방식과 다르면 기존 방식을 따른다.
   - 경로는 케밥케이스 소문자로 한다. 예: `SettingsPage` → `/settings`.
   - `--protected`면 `/todos`와 같은 방식으로 `ProtectedRoute`를 씌운다.
4. **검증**: `npm run typecheck`를 실행해 타입 오류가 없는지 확인한다.

## 완료 보고

- 생성한 파일 경로, 등록한 라우트 경로, 보호 여부를 한국어로 요약한다.
- 커밋은 하지 않는다.
