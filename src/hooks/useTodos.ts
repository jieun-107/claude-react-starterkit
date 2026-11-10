import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface Todo {
  id: number
  title: string
  completed: boolean
}

// 서버 상태 예제: Todo 목록 조회 (JSONPlaceholder 공개 API 사용)
// 오류는 TodosPage에서 직접 표시하므로 silent
export function useTodos(limit = 10) {
  return useQuery({
    queryKey: ['todos', limit],
    queryFn: async () => {
      const { data } = await api.get<Todo[]>('/todos', { params: { _limit: limit } })
      return data
    },
    meta: { silent: true },
  })
}
