import {
  FileText,
  House,
  Info,
  ListTodo,
  LogIn,
  LogOut,
  Moon,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

const navItems: NavItem[] = [
  { to: '/', label: '홈', icon: House, end: true },
  { to: '/about', label: '소개', icon: Info },
  { to: '/posts', label: 'Posts', icon: FileText },
  { to: '/todos', label: 'Todos', icon: ListTodo },
]

// 공통 레이아웃: 헤더(내비게이션, 테마 토글, 로그인 상태) + 페이지 영역(Outlet)
export function RootLayout() {
  const { theme, toggleTheme } = useThemeStore()
  const { user, logout } = useAuthStore()

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="font-bold">React Starter Kit</span>

          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(buttonVariants({ variant: isActive ? 'secondary' : 'ghost', size: 'sm' }))
                }
              >
                <Icon />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </Button>
            {user ? (
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut />
                로그아웃
              </Button>
            ) : (
              <NavLink to="/login" className={buttonVariants({ variant: 'default', size: 'sm' })}>
                <LogIn />
                로그인
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="text-muted-foreground border-t py-4 text-center text-xs">
        © {new Date().getFullYear()} React Starter Kit
      </footer>

      <Toaster />
    </div>
  )
}
