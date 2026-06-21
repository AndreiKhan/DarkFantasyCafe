import { Link, useNavigate } from 'react-router-dom'
import { AuthForm } from '@/features/auth/ui/AuthForm'
import { useRegister } from '@/features/auth'

function RegisterPage() {
  const navigate = useNavigate()
  const registerMutation = useRegister()

  return (
    <section className="center">
      <h1>Регистрация</h1>
      <AuthForm
        submitLabel="Создать аккаунт"
        error={registerMutation.isError ? 'Email занят' : undefined}
        onSubmit={async (values) => {
          await registerMutation.mutateAsync(values)
          navigate('/')
        }}
      />
      <p>
        <Link to="/login">Войти</Link>
      </p>
    </section>
  )
}

export default RegisterPage