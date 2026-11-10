import { beforeEach, describe, expect, it } from 'vitest'
import { useThemeStore } from '@/stores/themeStore'

describe('themeStore', () => {
  beforeEach(() => {
    useThemeStore.getState().setTheme('light')
  })

  it('toggleTheme 호출 시 dark 클래스를 토글한다', () => {
    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
