import { Link, useNavigate } from 'react-router-dom'
import { AuthForm } from '@/shared/ui'
import { useLogin } from '@/entities/Auth'

function LoginPage() {
  const navigate = useNavigate()
  const login = useLogin()

  return (
    <section className="center">
      <h1>Вход</h1>
      <AuthForm
        mode="login"
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