import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { z } from 'zod'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
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
    <section className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">글 작성 (POST)</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            label="제목"
            autoComplete="off"
            error={errors.title?.message}
            {...register('title')}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="body" className="text-sm font-medium">
              내용
            </label>
            <textarea
              id="body"
              rows={4}
              aria-invalid={Boolean(errors.body)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 aria-[invalid=true]:border-red-500 dark:border-slate-600 dark:bg-slate-800"
              {...register('body')}
            />
            {errors.body && <p className="text-sm text-red-600">{errors.body.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting || createPost.isPending}>
            {createPost.isPending ? '등록 중...' : '등록'}
          </Button>
          <p className="text-xs text-slate-500">
            JSONPlaceholder는 실제로 저장하지 않으므로 등록 후 목록에 새 글이 나타나지 않습니다.
          </p>
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">글 목록 (GET)</h2>
          <button onClick={() => refetch()} className="text-sm text-indigo-600 underline">
            {isFetching ? '갱신 중...' : '새로고침'}
          </button>
        </div>

        {isPending && <p>불러오는 중...</p>}
        {isError && <ErrorMessage error={error} onRetry={() => refetch()} />}
        {data && data.length === 0 && <p className="text-slate-500">글이 없습니다.</p>}
        {data && data.length > 0 && (
          <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-900">
            {data.map((post) => (
              <li key={post.id} className="px-4 py-3">
                <Link
                  to={`/posts/${post.id}`}
                  className="font-medium text-indigo-600 hover:underline"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
