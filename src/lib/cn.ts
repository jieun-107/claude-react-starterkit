// 조건부 클래스 문자열을 합치는 간단한 유틸리티
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
