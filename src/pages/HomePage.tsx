import { Link } from 'react-router'
import { useThemeStore } from '@/stores/themeStore'

// 홈: 스타터 킷에 포함된 기능 안내
export function HomePage() {
  const theme = useThemeStore((s) => s.theme)
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">React Starter Kit</h1>
      <p className="text-slate-600 dark:text-slate-400">
        현재 테마: <strong>{theme === 'dark' ? '다크' : '라이트'}</strong> (새로고침 후에도
        유지됩니다)
      </p>
      <ul className="list-inside list-disc space-y-1 text-slate-700 dark:text-slate-300">
        <li>라우팅: React Router v8 (중첩 라우트, lazy 로딩, 보호 라우트)</li>
        <li>상태 관리: Zustand (persist 미들웨어)</li>
        <li>서버 상태: TanStack Query + Axios</li>
        <li>폼/검증: React Hook Form + Zod</li>
        <li>스타일: Tailwind CSS v4, 다크 모드</li>
      </ul>
      <div>
        <Link to="/todos" className="text-indigo-600 underline">
          Todos 예제 보기 (로그인 필요)
        </Link>
      </div>
    </section>
  )
}
