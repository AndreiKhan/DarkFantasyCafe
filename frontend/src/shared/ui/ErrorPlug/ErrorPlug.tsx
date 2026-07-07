import { useTranslation } from 'react-i18next'
import './ErrorPlug.scss'

function ErrorPlug() {
  const { t } = useTranslation('common')
  return (
    <div
      className='error-plug'
      role='alert'
      aria-live='assertive'
    >
      {t('states.error')}
    </div>
  )
}

export default ErrorPlug
