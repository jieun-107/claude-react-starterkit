import axios from 'axios'
import { toApiError } from '@/lib/apiError'
import { useAuthStore } from '@/stores/authStore'

// 공용 axios 인스턴스: 기본 URL은 환경 변수에서 읽음 (백엔드 주소만 바꾸면 됨)
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

// 요청 인터셉터: 로그인 토큰이 있으면 Authorization 헤더 부착
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 응답 인터셉터: 모든 오류를 ApiError로 통일하고, 401이면 로그아웃 처리
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error)
    if (apiError.status === 401) {
      // 토큰이 만료되었거나 무효함: 상태를 비우면 ProtectedRoute가 로그인 페이지로 보냄
      useAuthStore.getState().logout()
    }
    return Promise.reject(apiError)
  },
)
