import { cn } from '@/lib/cn'
import { useToastStore } from '@/stores/toastStore'

// 화면 우하단에 알림(토스트)을 쌓아서 보여주는 컴포넌트
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.type === 'error' ? 'alert' : 'status'}
          className={cn(
            'pointer-events-auto flex items-start justify-between gap-3 rounded-md px-4 py-3 text-sm text-white shadow-lg',
            t.type === 'error' ? 'bg-red-600' : 'bg-emerald-600',
          )}
        >
          <span>{t.message}</span>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            aria-label="알림 닫기"
            className="opacity-80 hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
