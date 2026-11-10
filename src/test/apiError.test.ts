import { AxiosError, type AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'
import { ApiError, isApiError, toApiError } from '@/lib/apiError'

// 상태 코드와 본문을 가진 axios 오류 생성 헬퍼
function axiosErrorWith(status: number, data: unknown = {}) {
  const response = {
    status,
    statusText: '',
    headers: {},
    config: {},
    data,
  } as unknown as AxiosResponse
  return new AxiosError('요청 실패', 'ERR_BAD_RESPONSE', undefined, undefined, response)
}

describe('toApiError', () => {
  it('응답이 없으면 NETWORK_ERROR로 변환한다', () => {
    const error = new AxiosError('Network Error', 'ERR_NETWORK')
    const result = toApiError(error)

    expect(result.code).toBe('NETWORK_ERROR')
    expect(result.status).toBe(0)
    expect(result.message).toContain('네트워크')
  })

  it('타임아웃(ECONNABORTED)은 TIMEOUT으로 변환한다', () => {
    const error = new AxiosError('timeout', 'ECONNABORTED')
    expect(toApiError(error).code).toBe('TIMEOUT')
  })

  it('404는 NOT_FOUND로 변환한다', () => {
    const result = toApiError(axiosErrorWith(404))
    expect(result.code).toBe('NOT_FOUND')
    expect(result.status).toBe(404)
  })

  it('422의 필드별 오류 메시지를 details로 전달한다', () => {
    const result = toApiError(axiosErrorWith(422, { errors: { title: '제목은 필수입니다.' } }))

    expect(result.code).toBe('VALIDATION_ERROR')
    expect(result.details).toEqual({ title: '제목은 필수입니다.' })
  })

  it('서버가 준 message가 있으면 기본 메시지보다 우선한다', () => {
    const result = toApiError(axiosErrorWith(403, { message: '관리자만 가능합니다.' }))

    expect(result.code).toBe('FORBIDDEN')
    expect(result.message).toBe('관리자만 가능합니다.')
  })

  it('5xx는 SERVER_ERROR로 변환한다', () => {
    const result = toApiError(axiosErrorWith(503))
    expect(result.code).toBe('SERVER_ERROR')
    expect(result.status).toBe(503)
  })

  it('axios가 아닌 일반 오류는 UNKNOWN으로 변환한다', () => {
    expect(toApiError(new Error('boom')).code).toBe('UNKNOWN')
    expect(toApiError('문자열 오류').code).toBe('UNKNOWN')
  })

  it('이미 ApiError이면 그대로 반환한다', () => {
    const original = new ApiError('x', 400, 'BAD_REQUEST')
    expect(toApiError(original)).toBe(original)
    expect(isApiError(original)).toBe(true)
    expect(isApiError(new Error('x'))).toBe(false)
  })
})
