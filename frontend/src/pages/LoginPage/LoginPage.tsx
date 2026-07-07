import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthForm } from '@/shared/ui'
import { useLogin } from '@/entities/Auth'
import { getApiErrorMessage } from '@/shared/lib/apiError'

function LoginPage() {
  const navigate = useNavigate()
  const login = useLogin()
  const { t } = useTranslation('auth')

  return (
    <AuthForm
      mode='login'
      title={t('login.title')}
      submitLabel={t('login.submit')}
      error={login.isError ? getApiErrorMessage(login.error, t) : undefined}
      onSubmit={async (values) => {
        await login.mutateAsync(values)
        navigate('/')
      }}
      footer={<>{t('login.noAccount')} <Link to='/register'>{t('login.registerLink')}</Link></>}
    />
  )
}

export default LoginPage