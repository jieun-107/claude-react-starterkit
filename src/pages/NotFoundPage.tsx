import { Link } from 'react-router'

// 존재하지 않는 경로 처리
export function NotFoundPage() {
  return (
    <section className="space-y-3 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-slate-600 dark:text-slate-400">페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="text-indigo-600 underline">
        홈으로 이동
      </Link>
    </section>
  )
}
