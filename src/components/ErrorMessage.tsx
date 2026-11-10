import { Button } from '@/components/ui/Button'
import { toApiError } from '@/lib/apiError'

interface ErrorMessageProps {
  error: unknown
  onRetry?: () => void
}

// API 오류를 사용자에게 보여주는 공용 컴포넌트 (상태 코드, 메시지, 재시도 버튼)
export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const apiError = toApiError(error)
  const statusText = apiError.status > 0 ? ` (${apiError.status})` : ''

  return (
    <div
      role="alert"
      className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
    >
      <p className="font-semibold">오류가 발생했습니다{statusText}</p>
      <p className="mt-1">{apiError.message}</p>
      <p className="mt-1 text-xs opacity-70">오류 코드: {apiError.code}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-3" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  )
}
