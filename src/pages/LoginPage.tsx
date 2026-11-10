import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import { z } from 'zod'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/authStore'

// 폼 검증 스키마 (Zod 4)
const loginSchema = z.object({
  email: z.email({ error: '올바른 이메일 형식이 아닙니다.' }),
  password: z.string().min(8, { error: '비밀번호는 8자 이상이어야 합니다.' }),
})

type LoginForm = z.infer<typeof loginSchema>

// 로그인 예제 페이지: 실제 인증 API 대신 스토어에 사용자만 저장합니다.
export function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginForm) => {
    login(values.email)
    navigate(from, { replace: true })
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>
          데모 로그인입니다. 올바른 이메일과 8자 이상의 비밀번호를 입력하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
          <FormField id="email" label="이메일" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
            />
          </FormField>
          <FormField id="password" label="비밀번호" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              {...register('password')}
            />
          </FormField>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <LoaderCircle className="animate-spin" />}
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
