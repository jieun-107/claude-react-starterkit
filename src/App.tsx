import { AppProviders } from '@/app/providers'
import { AppRouter } from '@/app/router'

// 앱 루트: 전역 Provider(React Query 등)와 라우터를 연결
export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}
