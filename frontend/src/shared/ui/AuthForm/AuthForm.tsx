import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PhoneInput } from '@/shared/ui'
const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
})

const registerSchema = loginSchema.extend({
  firstName: z.string().min(1, 'имя'),
  secondName: z.string().min(1, 'фамилия'),
  phone: z.union([
    z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Формат: +7 (999) 123-45-67'),
    z.literal(''),
  ]).optional(),
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>

function AuthForm({ mode, submitLabel, onSubmit, error }: { 
  mode: 'login' | 'registration'
  submitLabel: string
  onSubmit: (values: LoginValues | RegisterValues) => Promise<void>
  error?: string | undefined
 }) {
  const isRegister = mode === 'registration'

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      {isRegister && (
        <>
          <label>
            Имя
            <input {...register('firstName')} />
            {errors.firstName &&
              <span>
                {errors.firstName.message}
              </span>
            }
          </label>
          <label>
            Фамилия
            <input {...register('secondName')} />
            {errors.secondName &&
              <span>
                {errors.secondName.message}
              </span>
            }
          </label>
          <label>
            Телефон
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.phone &&              <span>
                {errors.phone.message}
              </span>
            }
          </label>
        </>
      )}

      <label>
        Email
        <input type="email" {...register('email')} />
        {errors.email &&
          <span>
            {errors.email.message}
          </span>
        }
      </label>

      <label>
        Пароль
        <input
          type="password"
          {...register('password')}
        />
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

export default AuthForm