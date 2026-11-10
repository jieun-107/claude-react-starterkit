import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// 조건부 클래스 문자열을 합치고, Tailwind 충돌 클래스(예: p-2 vs p-4)를 정리하는 유틸리티 (shadcn/ui 표준)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
