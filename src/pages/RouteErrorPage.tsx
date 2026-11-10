import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

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
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-slate-600 dark:text-slate-400">{message}</p>
      <Link to="/" className="text-indigo-600 underline">
        홈으로 이동
      </Link>
    </div>
  )
}
