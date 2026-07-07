import './Loader.scss'
import { useTranslation } from 'react-i18next'
import d20 from '@/assets/images/cube.webp'

type LoaderProps = {
  height?: string
  width?: string
}

function Loader({ height = '50px', width = '50px' }: LoaderProps) {
  const { t } = useTranslation('common')

  return (
    <div
      className='loader'
      role='status'
      aria-live='polite'
      aria-label={t('a11y.loading')}
    >
      <img
        className='loader__icon'
        src={d20}
        alt=''
        aria-hidden='true'
        style={{ height, width }}
      />
    </div>
  )
}

export default Loader
