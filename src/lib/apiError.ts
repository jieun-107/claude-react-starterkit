import { isAxiosError } from 'axios'

// 앱 전체에서 사용하는 오류 코드 (화면 분기나 로깅에 활용)
export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN'

// 필드별 검증 오류 (예: { title: '제목은 필수입니다.' })
export type ApiErrorDetails = Record<string, string>

// 모든 API 오류를 이 형태로 통일해서 전달합니다.
export class ApiError extends Error {
  status: number
  code: ApiErrorCode
  details?: ApiErrorDetails

  constructor(message: string, status: number, code: ApiErrorCode, details?: ApiErrorDetails) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

// HTTP 상태 코드별 기본 메시지
const statusMap: Record<number, { code: ApiErrorCode; message: string }> = {
  400: { code: 'BAD_REQUEST', message: '잘못된 요청입니다.' },
  401: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' },
  403: { code: 'FORBIDDEN', message: '이 작업을 수행할 권한이 없습니다.' },
  404: { code: 'NOT_FOUND', message: '요청한 데이터를 찾을 수 없습니다.' },
  409: { code: 'CONFLICT', message: '이미 존재하는 데이터입니다.' },
  422: { code: 'VALIDATION_ERROR', message: '입력값을 확인해 주세요.' },
}

const NETWORK_MESSAGE = '네트워크 연결을 확인해 주세요.'
const TIMEOUT_MESSAGE = '요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.'
const SERVER_MESSAGE = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
const UNKNOWN_MESSAGE = '알 수 없는 오류가 발생했습니다.'

// 서버 응답 본문에서 메시지와 필드 오류를 안전하게 꺼냄 (형식이 달라도 오류가 나지 않도록)
function readServerBody(data: unknown): { message?: string; details?: ApiErrorDetails } {
  if (typeof data !== 'object' || data === null) return {}
  const body = data as { message?: unknown; errors?: unknown }
  const result: { message?: string; details?: ApiErrorDetails } = {}

  if (typeof body.message === 'string' && body.message.trim() !== '') {
    result.message = body.message
  }
  if (typeof body.errors === 'object' && body.errors !== null) {
    const entries = Object.entries(body.errors).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    )
    if (entries.length > 0) result.details = Object.fromEntries(entries)
  }
  return result
}

// 임의의 오류(axios 오류, 일반 Error, 알 수 없는 값)를 ApiError로 변환
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (isAxiosError(error)) {
    // 타임아웃: axios는 timeout 초과 시 ECONNABORTED 코드를 사용
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError(TIMEOUT_MESSAGE, 0, 'TIMEOUT')
    }

    // 응답 자체가 없음: 서버 미기동, CORS, 오프라인 등
    if (!error.response) {
      return new ApiError(NETWORK_MESSAGE, 0, 'NETWORK_ERROR')
    }

    const status = error.response.status
    const mapped = statusMap[status]
    const server = readServerBody(error.response.data)

    if (mapped) {
      return new ApiError(server.message ?? mapped.message, status, mapped.code, server.details)
    }
    if (status >= 500) {
      return new ApiError(server.message ?? SERVER_MESSAGE, status, 'SERVER_ERROR')
    }
    return new ApiError(server.message ?? UNKNOWN_MESSAGE, status, 'UNKNOWN', server.details)
  }

  return new ApiError(UNKNOWN_MESSAGE, 0, 'UNKNOWN')
}

// 타입 가드: 이미 정규화된 ApiError인지 확인
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
