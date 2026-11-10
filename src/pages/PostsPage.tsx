import { zodResolver } from '@hookform/resolvers/zod'
import { FilePlus, LoaderCircle, RefreshCw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { z } from 'zod'
import { ErrorMessage } from '@/components/ErrorMessage'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { isApiError } from '@/lib/apiError'
import { useCreatePost, usePosts } from '@/hooks/usePosts'

// 글 작성 폼 검증 스키마 (Zod 4)
const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: '제목을 입력해 주세요.' })
    .max(100, { error: '제목은 100자 이하여야 합니다.' }),
  body: z.string().trim().min(1, { error: '내용을 입력해 주세요.' }),
})

type PostForm = z.infer<typeof postSchema>

// 데모용 작성자 ID (실제 서비스에서는 로그인 사용자 정보를 사용)
const DEMO_USER_ID = 1

// GET(목록) + POST(작성) 예제 페이지
export function PostsPage() {
  const { data, isPending, isError, error, refetch, isFetching } = usePosts(10)
  const createPost = useCreatePost()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', body: '' },
  })

  const onSubmit = async (values: PostForm) => {
    try {
      await createPost.mutateAsync({ ...values, userId: DEMO_USER_ID })
      reset()
    } catch (err) {
      // 422 검증 오류의 필드별 메시지를 폼 입력 아래에 매핑 (알 수 없는 필드는 토스트로만 표시)
      if (isApiError(err) && err.details) {
        for (const [field, message] of Object.entries(err.details)) {
          if (field === 'title' || field === 'body') {
            setError(field, { type: 'server', message })
          }
        }
      }
    }
  }

  return (
    <section className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>글 작성 (POST)</CardTitle>
          <CardDescription>
            JSONPlaceholder는 실제로 저장하지 않으므로 등록 후 목록에 새 글이 나타나지 않습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
            <FormField id="title" label="제목" error={errors.title?.message}>
              <Input
                id="title"
                autoComplete="off"
                aria-invalid={Boolean(errors.title)}
                {...register('title')}
              />
            </FormField>
            <FormField id="body" label="내용" error={errors.body?.message}>
              <Textarea
                id="body"
                rows={4}
                aria-invalid={Boolean(errors.body)}
                {...register('body')}
              />
            </FormField>
            <Button
              type="submit"
              className="justify-self-start"
              disabled={isSubmitting || createPost.isPending}
            >
              {createPost.isPending ? <LoaderCircle className="animate-spin" /> : <FilePlus />}
              {createPost.isPending ? '등록 중...' : '등록'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">글 목록 (GET)</h2>
          <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={isFetching ? 'animate-spin' : undefined} />
            새로고침
          </Button>
        </div>

        {isPending && (
          <div className="grid gap-3" aria-label="목록 불러오는 중">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
        {isError && <ErrorMessage error={error} onRetry={() => refetch()} />}
        {data && data.length === 0 && <p className="text-muted-foreground">글이 없습니다.</p>}
        {data && data.length > 0 && (
          <Card className="py-0">
            <ul className="divide-y">
              {data.map((post) => (
                <li key={post.id} className="px-4 py-3">
                  <Link
                    to={`/posts/${post.id}`}
                    className="text-primary font-medium hover:underline"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>
    </section>
  )
}
