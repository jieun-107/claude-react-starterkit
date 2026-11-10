import { useTodos } from '@/hooks/useTodos'

// React Query + Axios 데이터 조회 예제 페이지
export function TodosPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useTodos(10)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Todos</h1>
        <button onClick={() => refetch()} className="text-sm text-indigo-600 underline">
          {isFetching ? '갱신 중...' : '새로고침'}
        </button>
      </div>

      {isPending && <p>불러오는 중...</p>}
      {isError && <p className="text-red-600">오류: {error.message}</p>}
      {data && (
        <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-900">
          {data.map((todo) => (
            <li key={todo.id} className="flex items-center gap-3 px-4 py-3">
              <input type="checkbox" readOnly checked={todo.completed} className="size-4" />
              <span className={todo.completed ? 'text-slate-400 line-through' : ''}>
                {todo.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
