import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
})

type FormValues = z.infer<typeof schema>

interface AuthFormProps {
  submitLabel: string
  onSubmit: (values: FormValues) => Promise<void>
  error?: string | undefined
}

export function AuthForm({ submitLabel, onSubmit, error }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <label>
        Email
        <input type="email" autoComplete="email" {...register('email')} />
        {errors.email &&
          <span>
            {errors.email.message}
          </span>
        }
      </label>
      <label>
        Пароль
        <input type="password" autoComplete="current-password" {...register('password')} />
        {errors.password &&
          <span>
            {errors.password.message}
          </span>
        }
      </label>
      {error &&
        <p className="auth-form__error">
          {error}
        </p>
      }
      <button type="submit" disabled={isSubmitting}>
        {submitLabel}
      </button>
    </form>
  )
}