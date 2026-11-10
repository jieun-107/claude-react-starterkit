import {
  AxiosError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createPost, getPost, getPosts } from '@/api/posts'
import { api } from '@/lib/api'
import { ApiError } from '@/lib/apiError'
import { useAuthStore } from '@/stores/authStore'

// 실제 네트워크 대신 응답을 흉내 내는 axios 어댑터 (4xx/5xx는 axios처럼 오류로 던짐)
function mockAdapter(
  respond: (config: InternalAxiosRequestConfig) => { status: number; data: unknown },
): AxiosAdapter {
  return async (config) => {
    const { status, data } = respond(config)
    const response = {
      status,
      statusText: '',
      headers: {},
      config,
      data,
    } as unknown as AxiosResponse
    if (status >= 400) {
      throw new AxiosError('Request failed', 'ERR_BAD_RESPONSE', config, undefined, response)
    }
    return response
  }
}

const originalAdapter = api.defaults.adapter

beforeEach(() => {
  useAuthStore.setState({ user: null, token: null })
})

afterEach(() => {
  api.defaults.adapter = originalAdapter
})

describe('posts API', () => {
  it('GET 목록: _limit 파라미터를 붙여 요청하고 데이터를 반환한다', async () => {
    let requestedLimit: unknown
    api.defaults.adapter = mockAdapter((config) => {
      requestedLimit = config.params?._limit
      return { status: 200, data: [{ id: 1, userId: 1, title: 't', body: 'b' }] }
    })

    const posts = await getPosts(2)

    expect(requestedLimit).toBe(2)
    expect(posts).toHaveLength(1)
    expect(posts[0].title).toBe('t')
  })

  it('GET 단건: 404 응답이면 ApiError(NOT_FOUND)로 거절된다', async () => {
    api.defaults.adapter = mockAdapter(() => ({ status: 404, data: {} }))

    await expect(getPost(9999)).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      code: 'NOT_FOUND',
    })
    await expect(getPost(9999)).rejects.toBeInstanceOf(ApiError)
  })

  it('POST: JSON 바디를 전송하고 201 응답의 데이터를 반환한다', async () => {
    let sent: { method?: string; body?: string } = {}
    api.defaults.adapter = mockAdapter((config) => {
      sent = { method: config.method, body: config.data as string }
      return { status: 201, data: { id: 101, userId: 1, title: '새 글', body: '내용' } }
    })

    const created = await createPost({ userId: 1, title: '새 글', body: '내용' })

    expect(sent.method).toBe('post')
    expect(JSON.parse(sent.body ?? '{}')).toEqual({ userId: 1, title: '새 글', body: '내용' })
    expect(created.id).toBe(101)
  })

  it('로그인 토큰이 있으면 Authorization 헤더를 붙인다', async () => {
    useAuthStore.setState({ token: 'abc123' })
    let authorization: unknown
    api.defaults.adapter = mockAdapter((config) => {
      authorization = config.headers.Authorization
      return { status: 200, data: [] }
    })

    await getPosts()

    expect(authorization).toBe('Bearer abc123')
  })

  it('401 응답이면 로그아웃 처리되어 사용자 상태가 비워진다', async () => {
    useAuthStore.setState({ user: { email: 'a@b.c' }, token: 'expired' })
    api.defaults.adapter = mockAdapter(() => ({ status: 401, data: {} }))

    await expect(getPosts()).rejects.toMatchObject({ status: 401, code: 'UNAUTHORIZED' })
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().token).toBeNull()
  })
})
