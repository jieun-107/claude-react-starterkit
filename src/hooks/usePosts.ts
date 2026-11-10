import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPost, getPost, getPosts } from '@/api/posts'
import { toast } from '@/stores/toastStore'

// 목록 조회 (GET). 오류는 화면에서 ErrorMessage로 직접 표시하므로 silent
export function usePosts(limit = 10) {
  return useQuery({
    queryKey: ['posts', 'list', limit],
    queryFn: () => getPosts(limit),
    meta: { silent: true },
  })
}

// 단건 조회 (GET). id가 유효하지 않으면 요청하지 않음
export function usePost(id: number) {
  return useQuery({
    queryKey: ['posts', 'detail', id],
    queryFn: () => getPost(id),
    enabled: Number.isInteger(id) && id > 0,
    meta: { silent: true },
  })
}

// 생성 (POST). 성공 시 글 관련 캐시를 무효화해 목록을 다시 불러옴
export function useCreatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPost,
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success(`글이 등록되었습니다. (id: ${post.id})`)
    },
  })
}
