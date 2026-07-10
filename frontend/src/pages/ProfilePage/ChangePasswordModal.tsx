import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader, Modal } from '@/shared/ui'
import { useLogout } from '@/entities/Auth'
import { changePassword, verifyPassword } from '@/entities/User'
import { getApiErrorMessage } from '@/shared/lib/apiError'
import { ROUTES } from '@/shared/config/routes'

function ChangePasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation(['profile', 'common', 'errors'])
  const logout = useLogout()
  const navigate = useNavigate()
  const [step, setStep] = useState<'current' | 'new'>('current')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setStep('current')
      setCurrentPassword('')
      setNewPassword('')
      setError('')
      setSuccess(false)
      setPending(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!success) {
      return
    }
    const timer = setTimeout(() => {
      logout.mutate(undefined, {
        onSettled: () => navigate(ROUTES.login),
      })
    }, 3000)
    return () => clearTimeout(timer)
  }, [success])

  const handleVerify = async () => {
    setError('')
    setPending(true)
    try {
      await verifyPassword(currentPassword)
      setStep('new')
    } catch (err) {
      setError(getApiErrorMessage(err, t))
    } finally {
      setPending(false)
    }
  }

  const handleSave = async () => {
    setError('')
    if (newPassword.length < 8) {
      setError(t('errors:validation.passwordMin'))
      return
    }

    setPending(true)
    try {
      await changePassword(currentPassword, newPassword)
      setSuccess(true)
    } catch (err) {
      setError(getApiErrorMessage(err, t))
    } finally {
      setPending(false)
    }
  }

  return (
    <Modal title={t('profile:password.title')} isOpen={isOpen} onClose={onClose}>
      <div className='profile__password-modal'>
        {success ? (
          <p className='profile__status profile__status--success' role='status'>
            {t('profile:password.success')}
          </p>
        ) : step === 'current' ? (
          <>
            <label className='profile__field'>
              {t('profile:password.current')}
              <div className='input-parchment-wrapper'>
                <input
                  type='password'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete='current-password'
                />
              </div>
            </label>
            <button className='profile__submit' type='button' disabled={pending || !currentPassword} onClick={handleVerify}>
              {t('profile:password.continue')}
            </button>
          </>
        ) : (
          <>
            <label className='profile__field'>
              {t('profile:password.new')}
              <div className='input-parchment-wrapper'>
                <input
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete='new-password'
                />
              </div>
            </label>
            <button className='profile__submit' type='button' disabled={pending || !newPassword} onClick={handleSave}>
              {pending ? <Loader width='30px' height='30px' /> : t('profile:password.save')}
            </button>
          </>
        )}

        {error &&
          <p className='profile__status profile__status--error' role='alert'>
            {error}
          </p>
        }
      </div>
    </Modal>
  )
}

export default ChangePasswordModal
