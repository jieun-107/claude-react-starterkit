import { Home } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'

// 존재하지 않는 경로 처리
export function NotFoundPage() {
  return (
    <section className="flex flex-col items-center gap-4 py-12 text-center">
      <h1 className="text-5xl font-bold tracking-tight">404</h1>
      <p className="text-muted-foreground">페이지를 찾을 수 없습니다.</p>
      <Link to="/" className={buttonVariants({ variant: 'outline' })}>
        <Home />
        홈으로 이동
      </Link>
    </section>
  )
}
