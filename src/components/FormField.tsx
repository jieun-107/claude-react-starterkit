import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  children: ReactNode
}

// 라벨 + 입력 요소 + 오류 메시지를 묶는 폼 필드 래퍼 (children에 id가 같은 input/textarea를 넣음)
export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
