import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: { email: string } | null
  login: (email: string) => void
  logout: () => void
}

// 인증 상태 예제: 실제 서비스에서는 서버 인증 API 호출로 교체하세요.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email) => set({ user: { email } }),
      logout: () => set({ user: null }),
    }),
    { name: 'auth-storage' },
  ),
)
