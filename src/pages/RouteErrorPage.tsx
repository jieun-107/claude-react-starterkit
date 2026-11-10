import { Home, TriangleAlert } from 'lucide-react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'

// 라우트 렌더링 중 발생한 오류(잘못된 라우트 응답, 예외, 청크 로딩 실패 등)를 표시
export function RouteErrorPage() {
  const error = useRouteError()

  let title = '예기치 않은 오류가 발생했습니다.'
  let message = '잠시 후 다시 시도해 주세요.'

  if (isRouteErrorResponse(error)) {
    title = `${error.status} 오류`
    message = error.statusText || message
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-4">
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <Link to="/" className={buttonVariants({ variant: 'outline' })}>
        <Home />
        홈으로 이동
      </Link>
    </div>
  )
}
