import { Link, useNavigate } from 'react-router-dom'
import { AuthForm } from '@/features/auth/ui/AuthForm'
import { useLogin } from '@/features/auth'

function LoginPage() {
  const navigate = useNavigate()
  const login = useLogin()

  return (
    <section className="center">
      <h1>Вход</h1>
      <AuthForm
        submitLabel="Войти"
        error={login.isError ? 'Неверный email или пароль' : undefined}
        onSubmit={async (values) => {
          await login.mutateAsync(values)
          navigate('/')
        }}
      />
      <p>
        <Link to="/register">Регистрация</Link>
      </p>
    </section>
  )
}

export default LoginPage