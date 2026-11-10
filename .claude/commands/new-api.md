---
description: 리소스 하나에 대한 API 계층(api, hooks, test) 파일을 한 번에 만든다
argument-hint: <리소스이름> (예: comments)
---

API 계층 파일 세트를 만든다. 리소스 이름: `$ARGUMENTS`

## 입력 처리

1. 리소스 이름은 소문자 복수형 단어 하나여야 한다. 예: `comments`, `users`.
2. 이름이 비어 있거나 여러 단어면 중단하고 확인을 요청한다.
3. 아래 파일 중 하나라도 이미 있으면 덮어쓰지 말고 중단한다.
   - `src/api/<리소스>.ts`
   - `src/hooks/use<PascalCase리소스>.ts`
   - `src/test/<리소스>.test.ts`

## 작업 순서

1. **참고 파일 읽기**: 아래 세 파일을 먼저 읽고 패턴을 파악한다.
   - `src/lib/api.ts` (axios 인스턴스)
   - `src/api/posts.ts` (요청 함수와 타입)
   - `src/hooks/usePosts.ts` (TanStack Query 훅)
   - `src/test/posts.test.ts` (테스트 구조와 mock 방식)
2. **API 파일**: `src/api/<리소스>.ts`
   - `posts.ts`와 같은 방식으로 `api` 인스턴스를 사용한다.
   - 응답 타입과 요청 함수(목록 조회, 단건 조회, 생성 등 필요한 것만)를 export한다.
   - 엔드포인트 경로는 리소스 이름을 따른다.
3. **훅 파일**: `src/hooks/use<PascalCase리소스>.ts`
   - 조회는 `useQuery`, 변경은 `useMutation`으로 작성한다.
   - `queryKey`는 리소스 이름 기반 배열로 일관되게 짓는다.
   - 기존 훅의 반환 형태와 옵션 스타일을 따른다.
4. **테스트 파일**: `src/test/<리소스>.test.ts`
   - `posts.test.ts`와 같은 mock 방식으로 API 함수를 검증하는 테스트를 작성한다.
   - 테스트 이름은 한국어로 쓴다.
5. **검증**: `npx vitest run src/test/<리소스>.test.ts`를 실행해 통과하는지 확인한다.

## 완료 보고

- 생성한 세 파일 경로와 export한 함수 및 훅 목록을 한국어로 요약한다.
- 실제 백엔드 엔드포인트는 추정이므로, 경로가 맞는지 사용자에게 확인을 요청한다.
- 커밋은 하지 않는다.
