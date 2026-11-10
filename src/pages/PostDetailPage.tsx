import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { ErrorMessage } from '@/components/ErrorMessage'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePost } from '@/hooks/usePosts'

// 단건 조회(GET /posts/:id) 예제 페이지. 404 오류 확인용 링크 포함
export function PostDetailPage() {
  const { id } = useParams()
  const postId = Number(id)
  const isValidId = Number.isInteger(postId) && postId > 0

  const { data, isPending, isError, error, refetch } = usePost(postId)

  return (
    <section className="grid gap-6">
      <Link
        to="/posts"
        className={buttonVariants({
          variant: 'ghost',
          size: 'sm',
          className: 'justify-self-start',
        })}
      >
        <ArrowLeft />
        목록으로
      </Link>

      {!isValidId && <p className="text-destructive">잘못된 글 번호입니다: {id}</p>}

      {isValidId && isPending && (
        <div className="grid gap-3" aria-label="글 불러오는 중">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}
      {isValidId && isError && <ErrorMessage error={error} onRetry={() => refetch()} />}

      {isValidId && data && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{data.title}</CardTitle>
            <CardDescription>
              #{data.id} · 작성자 {data.userId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{data.body}</p>
          </CardContent>
        </Card>
      )}

      <p className="text-muted-foreground text-xs">
        오류 처리 확인:{' '}
        <Link to="/posts/9999" className="text-primary underline">
          존재하지 않는 글(9999)
        </Link>
        을 열면 404 오류가 표시됩니다.
      </p>
    </section>
  )
}
