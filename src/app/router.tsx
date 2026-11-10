import { createBrowserRouter, RouterProvider } from 'react-router'
import { RootLayout } from '@/layouts/RootLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// 라우트 정의: 레이아웃 라우트 + 중첩 라우트 + 보호 라우트 + lazy 로딩
const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      {
        path: 'about',
        lazy: () => import('@/pages/AboutPage').then((m) => ({ Component: m.AboutPage })),
      },
      {
        path: 'login',
        lazy: () => import('@/pages/LoginPage').then((m) => ({ Component: m.LoginPage })),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'todos',
            lazy: () => import('@/pages/TodosPage').then((m) => ({ Component: m.TodosPage })),
          },
        ],
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
