import axios from 'axios'

// 공용 axios 인스턴스: 기본 URL은 환경 변수에서 읽음
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})
