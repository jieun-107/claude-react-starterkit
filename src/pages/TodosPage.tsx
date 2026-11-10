import { RefreshCw } from 'lucide-react'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { useTodos } from '@/hooks/useTodos'

// React Query + Axios 데이터 조회 예제 페이지
export function TodosPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useTodos(10)

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Todos</h1>
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

      {data && (
        <Card className="py-0">
          <ul className="divide-y">
            {data.map((todo) => (
              <li key={todo.id} className="flex items-center gap-3 px-4 py-3">
                <Checkbox id={`todo-${todo.id}`} checked={todo.completed} disabled />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={todo.completed ? 'text-muted-foreground line-through' : undefined}
                >
                  {todo.title}
                </label>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </section>
  )
}
