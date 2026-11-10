import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: { email: string } | null
  token: string | null
  login: (email: string) => void
  logout: () => void
}

// 인증 상태 예제: 실제 서비스에서는 서버 로그인 API가 발급한 토큰을 저장하세요.
// 주의: localStorage 저장은 학습용 예제입니다. 운영에서는 httpOnly 쿠키 사용을 권장합니다.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (email) => set({ user: { email }, token: 'demo-token' }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' },
  ),
)
