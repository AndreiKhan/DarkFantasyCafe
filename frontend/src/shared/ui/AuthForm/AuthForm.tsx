import { useMemo, type ReactNode } from 'react'
import { useForm, Controller, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import PhoneInput from '../PhoneInput/PhoneInput'
import './AuthForm.scss'

const createLoginSchema = (t: TFunction) => z.object({
  email: z.string().email(t('errors:validation.emailInvalid')),
  password: z.string().min(8, t('errors:validation.passwordMin')),
})

const createRegisterSchema = (t: TFunction) => createLoginSchema(t).extend({
  firstName: z.string().min(1, t('errors:validation.firstNameRequired')),
  secondName: z.string().min(1, t('errors:validation.secondNameRequired')),
  phone: z.union([
    z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, t('errors:validation.phoneFormat')),
    z.literal(''),
  ]).optional(),
})

export type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>
export type RegisterValues = z.infer<ReturnType<typeof createRegisterSchema>>

function AuthForm({ mode, title, submitLabel, onSubmit, error, footer }: {
  mode: 'login' | 'registration'
  title: string
  submitLabel: string
  onSubmit: (values: LoginValues | RegisterValues) => Promise<void>
  error?: string | undefined
  footer?: ReactNode
}) {
  const isRegister = mode === 'registration'
  const { t } = useTranslation(['auth', 'common'])

  const resolver = useMemo<Resolver<RegisterValues>>(
    () => (isRegister
      ? zodResolver(createRegisterSchema(t))
      : zodResolver(createLoginSchema(t)) as unknown as Resolver<RegisterValues>),
    [isRegister, t],
  )

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<RegisterValues>({
    resolver,
  })

  return (
    <div className='auth-page'>
      <div className='auth-page__container'>
        <div className='auth-page__card'>
          <h1 className='auth-page__title'>
            {title}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className='auth-form'>
            {isRegister && (
              <>
                <label className='auth-form__field'>
                  {t('common:fields.firstName')}*
                  <div className='input-parchment-wrapper'>
                    <input
                      {...register('firstName')}
                      autoComplete='given-name'
                      aria-required='true'
                      aria-invalid={Boolean(errors.firstName)}
                      aria-describedby={errors.firstName ? 'auth-firstName-error' : undefined}
                    />
                  </div>
                  {errors.firstName &&
                    <span className='auth-form__field-error' id='auth-firstName-error' role='alert'>
                      {errors.firstName.message}
                    </span>
                  }
                </label>

                <label className='auth-form__field'>
                  {t('common:fields.secondName')}*
                  <div className='input-parchment-wrapper'>
                    <input
                      {...register('secondName')}
                      autoComplete='family-name'
                      aria-required='true'
                      aria-invalid={Boolean(errors.secondName)}
                      aria-describedby={errors.secondName ? 'auth-secondName-error' : undefined}
                    />
                  </div>
                  {errors.secondName &&
                    <span className='auth-form__field-error' id='auth-secondName-error' role='alert'>
                      {errors.secondName.message}
                    </span>
                  }
                </label>

                <label className='auth-form__field'>
                  {t('common:fields.phone')}
                  <Controller
                    name='phone'
                    control={control}
                    render={({ field }) => (
                      <div className='input-parchment-wrapper'>
                        <PhoneInput
                          name={field.name}
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      </div>
                    )}
                  />
                  {errors.phone &&
                    <span className='auth-form__field-error' id='auth-phone-error' role='alert'>
                      {errors.phone.message}
                    </span>
                  }
                </label>
              </>
            )}

            <label className='auth-form__field'>
              {t('common:fields.email')}*
              <div className='input-parchment-wrapper'>
                <input
                  type='email'
                  {...register('email')}
                  autoComplete='email'
                  aria-required='true'
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'auth-email-error' : undefined}
                />
              </div>
              {errors.email &&
                <span className='auth-form__field-error' id='auth-email-error' role='alert'>
                  {errors.email.message}
                </span>
              }
            </label>

            <label className='auth-form__field'>
              {t('common:fields.password')}*
              <div className='input-parchment-wrapper'>
                <input
                  type='password'
                  {...register('password')}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  aria-required='true'
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'auth-password-error' : undefined}
                />
              </div>
              {errors.password &&
                <span className='auth-form__field-error' id='auth-password-error' role='alert'>
                  {errors.password.message}
                </span>
              }
            </label>

            {error &&
              <p className='auth-form__error' role='alert'>
                {error}
              </p>
            }

            <button className='auth-form__submit' type='submit' disabled={isSubmitting} aria-busy={isSubmitting}>
              {submitLabel}
            </button>
          </form>

          {footer &&
            <>
              <div className='auth-page__divider' />
              <div className='auth-page__footer'>
                {footer}
              </div>
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default AuthForm