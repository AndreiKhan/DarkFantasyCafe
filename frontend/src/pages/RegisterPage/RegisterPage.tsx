import { Link, useNavigate } from 'react-router-dom'
import { AuthForm, type RegisterValues } from '@/shared/ui/AuthForm'
import { useRegister } from '@/entities/Auth'

function RegisterPage() {
  const navigate = useNavigate()
  const registerMutation = useRegister()

  return (
    <section className="center">
      <h1>Регистрация</h1>
      <AuthForm
        mode="registration"
        submitLabel="создать"
        error={registerMutation.isError ? 'Email занят' : undefined}
        onSubmit={async (values) => {
          await registerMutation.mutateAsync(values as RegisterValues)
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