import { create } from 'zustand'

export type ToastType = 'success' | 'error'

export interface Toast {
  id: number
  type: ToastType
  message: string
}

interface ToastState {
  toasts: Toast[]
  push: (type: ToastType, message: string) => void
  dismiss: (id: number) => void
}

const TOAST_DURATION_MS = 4000
let nextId = 0

// 알림(토스트) 상태: 일정 시간이 지나면 자동으로 사라짐
export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  push: (type, message) => {
    const id = ++nextId
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, TOAST_DURATION_MS)
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

// 컴포넌트 밖(QueryClient 캐시 등)에서도 호출할 수 있는 헬퍼
export const toast = {
  success: (message: string) => useToastStore.getState().push('success', message),
  error: (message: string) => useToastStore.getState().push('error', message),
}
