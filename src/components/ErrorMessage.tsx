import { RefreshCw, TriangleAlert } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
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
    <Alert variant="destructive">
      <TriangleAlert />
      <AlertTitle>오류가 발생했습니다{statusText}</AlertTitle>
      <AlertDescription>
        <p>{apiError.message}</p>
        <p className="text-xs opacity-70">오류 코드: {apiError.code}</p>
        {onRetry && (
          <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
            <RefreshCw />
            다시 시도
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
