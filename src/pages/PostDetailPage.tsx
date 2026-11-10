import { Link, useParams } from 'react-router'
import { ErrorMessage } from '@/components/ErrorMessage'
import { usePost } from '@/hooks/usePosts'

// 단건 조회(GET /posts/:id) 예제 페이지. 404 오류 확인용 링크 포함
export function PostDetailPage() {
  const { id } = useParams()
  const postId = Number(id)
  const isValidId = Number.isInteger(postId) && postId > 0

  const { data, isPending, isError, error, refetch } = usePost(postId)

  return (
    <section className="space-y-6">
      <Link to="/posts" className="text-sm text-indigo-600 underline">
        ← 목록으로
      </Link>

      {!isValidId && <p className="text-red-600">잘못된 글 번호입니다: {id}</p>}

      {isValidId && isPending && <p>불러오는 중...</p>}
      {isValidId && isError && <ErrorMessage error={error} onRetry={() => refetch()} />}

      {isValidId && data && (
        <article className="space-y-3 rounded-md border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h1 className="text-2xl font-bold">{data.title}</h1>
          <p className="text-sm text-slate-500">
            #{data.id} · 작성자 {data.userId}
          </p>
          <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">{data.body}</p>
        </article>
      )}

      <p className="text-xs text-slate-500">
        오류 처리 확인:{' '}
        <Link to="/posts/9999" className="underline">
          존재하지 않는 글(9999)
        </Link>
        을 열면 404 오류가 표시됩니다.
      </p>
    </section>
  )
}
