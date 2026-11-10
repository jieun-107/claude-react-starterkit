import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toApiError } from '@/lib/apiError'
import { toast } from '@/stores/toastStore'

// 재시도해도 결과가 같은 4xx 오류는 재시도하지 않음 (네트워크/5xx 등 일시적 오류만 1회 재시도)
const NO_RETRY_STATUSES = [400, 401, 403, 404, 409, 422]

function shouldRetry(failureCount: number, error: unknown): boolean {
  const { status } = toApiError(error)
  if (NO_RETRY_STATUSES.includes(status)) return false
  return failureCount < 1
}

// 전역 오류 처리:
// - 쿼리 오류는 meta.silent가 아닌 경우에만 토스트 표시 (화면에 직접 표시하는 쿼리는 silent 사용)
// - 뮤테이션(등록/수정/삭제) 오류는 항상 토스트 표시
const queryCache = new QueryCache({
  onError: (error, query) => {
    if (query.meta?.silent) return
    toast.error(toApiError(error).message)
  },
})

const mutationCache = new MutationCache({
  onError: (error) => {
    toast.error(toApiError(error).message)
  },
})

// 서버 상태 기본 옵션: 탭 전환 시 재요청 끔, 일시적 오류만 재시도
export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: shouldRetry,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})
