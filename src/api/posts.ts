import { api } from '@/lib/api'

// 백엔드 응답 타입 (실제 백엔드 스키마에 맞게 수정)
export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

// 생성 요청 바디
export interface NewPost {
  userId: number
  title: string
  body: string
}

// GET: 글 목록 (limit 개수만큼)
export async function getPosts(limit = 10): Promise<Post[]> {
  const { data } = await api.get<Post[]>('/posts', { params: { _limit: limit } })
  return data
}

// GET: 글 단건 조회
export async function getPost(id: number): Promise<Post> {
  const { data } = await api.get<Post>(`/posts/${id}`)
  return data
}

// POST: 글 생성
export async function createPost(input: NewPost): Promise<Post> {
  const { data } = await api.post<Post>('/posts', input)
  return data
}
