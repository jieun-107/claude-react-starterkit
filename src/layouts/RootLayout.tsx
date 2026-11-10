import { NavLink, Outlet } from 'react-router'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { cn } from '@/lib/cn'

const navItems = [
  { to: '/', label: '홈', end: true },
  { to: '/about', label: '소개' },
  { to: '/todos', label: 'Todos' },
]

// 공통 레이아웃: 헤더(내비게이션, 테마 토글, 로그인 상태) + 페이지 영역(Outlet)
export function RootLayout() {
  const { theme, toggleTheme } = useThemeStore()
  const { user, logout } = useAuthStore()

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="font-bold">React Starter Kit</span>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-1.5 text-sm',
                    isActive
                      ? 'bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={toggleTheme} aria-label="테마 전환">
              {theme === 'dark' ? '라이트 모드' : '다크 모드'}
            </Button>
            {user ? (
              <Button variant="secondary" onClick={logout}>
                로그아웃
              </Button>
            ) : (
              <NavLink
                to="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-indigo-600"
              >
                로그인
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-800">
        © {new Date().getFullYear()} React Starter Kit
      </footer>
    </div>
  )
}
