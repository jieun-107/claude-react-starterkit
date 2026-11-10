import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '@/components/ui/button'

describe('Button (shadcn/ui)', () => {
  it('텍스트를 렌더링하고 클릭 이벤트를 호출한다', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>저장</Button>)

    await userEvent.click(screen.getByRole('button', { name: '저장' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('variant에 따라 다른 스타일 클래스를 적용한다', () => {
    render(<Button variant="outline">외곽선</Button>)
    expect(screen.getByRole('button', { name: '외곽선' }).className).toContain('border')
  })
})
