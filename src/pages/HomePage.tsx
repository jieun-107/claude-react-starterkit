import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { useThemeStore } from '@/stores/themeStore'

const features = [
  '라우팅: React Router v8',
  '클라이언트 상태: Zustand',
  '서버 상태: TanStack Query + Axios',
  '폼/검증: React Hook Form + Zod',
  '스타일: Tailwind CSS v4 + shadcn/ui',
  '아이콘: lucide-react',
]

// 홈: 스타터 킷에 포함된 기능 안내
export function HomePage() {
  const theme = useThemeStore((s) => s.theme)

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">React Starter Kit</h1>
        <p className="text-muted-foreground">
          현재 테마:{' '}
          <strong className="text-foreground">{theme === 'dark' ? '다크' : '라이트'}</strong>{' '}
          (새로고침 후에도 유지됩니다)
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {features.map((feature) => (
          <Badge key={feature} variant="secondary">
            {feature}
          </Badge>
        ))}
      </div>

      <Link to="/todos" className={buttonVariants()}>
        Todos 예제 보기 (로그인 필요)
        <ArrowRight />
      </Link>
    </section>
  )
}
