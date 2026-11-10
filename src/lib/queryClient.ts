import { QueryClient } from '@tanstack/react-query'

// 서버 상태 기본 옵션: 탭 전환 시 재요청 끔, 실패 시 1회 재시도
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
