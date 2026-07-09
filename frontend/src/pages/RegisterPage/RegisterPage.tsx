import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthForm } from '@/shared/ui'
import { useRegister } from '@/entities/Auth'
import { getApiErrorMessage } from '@/shared/lib/apiError'

function RegisterPage() {
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const { t } = useTranslation('auth')

  return (
    <AuthForm
      mode='registration'
      title={t('register.title')}
      submitLabel={t('register.submit')}
      error={registerMutation.isError ? getApiErrorMessage(registerMutation.error, t) : undefined}
      onSubmit={async (values) => {
        if (!('firstName' in values)) {
          return
        }
        await registerMutation.mutateAsync(values)
        navigate('/')
      }}
      footer={<>{t('register.hasAccount')} <Link to='/login'>{t('register.loginLink')}</Link></>}
    />
  )
}

export default RegisterPage