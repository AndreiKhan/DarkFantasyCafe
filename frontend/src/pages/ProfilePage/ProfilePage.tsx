import './ProfilePage.scss'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMe, useLogout } from '@/entities/Auth'
import { useProfile, useUpdateProfile, type UpdateProfileInput } from '@/entities/User'
import { useCharacters, useReferenceData, lookupName } from '@/entities/Character'
import { useMyReservations, type ReservationSummary } from '@/entities/Reservation'
import { PhoneInput, ImageDropzone, Loader, ErrorPlug } from '@/shared/ui'
import { formatDateTime } from '@/shared/lib/datetime'
import { getApiErrorMessage } from '@/shared/lib/apiError'
import { ROUTES } from '@/shared/config/routes'
import ChangePasswordModal from './ChangePasswordModal'
import ReservationDetailModal from './ReservationDetailModal'

const FIELD_KEYS: (keyof UpdateProfileInput)[] = [
  'firstName',
  'secondName',
  'email',
  'phone',
  'bio',
]

function getInitials(firstName: string, secondName: string) {
  return `${firstName[0] ?? ''}${secondName[0] ?? ''}`.toUpperCase()
}

function ProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const { t, i18n } = useTranslation(['profile', 'common', 'character', 'reservation'])
  const { data: me } = useMe()
  const { data, isLoading, isError } = useProfile(userId!)
  const { data: characters } = useCharacters()
  const { data: dnd } = useReferenceData()

  const update = useUpdateProfile(userId!)
  const logout = useLogout()
  const navigate = useNavigate()
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<ReservationSummary | null>(null)
  const isOwnProfile = me?.user.sub === userId
  const userCharacters = characters?.filter((character) => character.userId === userId) ?? []
  const { data: myReservations } = useMyReservations(isOwnProfile)

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<UpdateProfileInput>({
    defaultValues: { firstName: '', secondName: '', email: '', phone: '', image: '', bio: '' },
  })

  useEffect(() => {
    if (data) {
      reset({
        firstName: data.firstName,
        secondName: data.secondName,
        email: data.email ?? '',
        phone: data.phone ?? '',
        image: data.image ?? '',
        bio: data.bio ?? '',
      })
    }
  }, [data, reset])

  if (isLoading) {
    return <Loader width='200px' height='200px' />
  }
  if (isError || !data) {
    return <ErrorPlug />
  }

  return (
    <section className='profile'>
      <div className='center'>
        <div className='profile__content'>
          <div className='profile__avatar'>
            <div className='profile__avatar-frame'>
              {data.image ? (
                <img className='profile__avatar-image' src={data.image} alt={data.firstName} />
              ) : (
                <div className='profile__avatar-placeholder'>
                  {getInitials(data.firstName, data.secondName)}
                </div>
              )}
            </div>

            {data.role &&
              <span className='profile__badge'>
                {t(`common:roles.${data.role}`, { defaultValue: data.role })}
              </span>
            }

            <div className='profile__characters'>
              <div className='profile__characters-info'>
                <h2 className='profile__characters-title'>
                  {t('profile:characters.title')}
                </h2>

                {userCharacters.length === 0 ? (
                  <p className='profile__characters-empty'>
                    {t('character:list.empty')}
                  </p>
                ) : (
                  <ul className='profile__characters-list'>
                    {userCharacters.map((character) => (
                      <li key={character.id}>
                        <Link className='profile__characters-link' to={ROUTES.character(character.id)}>
                          <span className='profile__characters-name'>
                            {character.name}
                          </span>
                          <span className='profile__characters-meta'>
                            {t('character:fields.level')} {character.level} · {lookupName(dnd?.races ?? [], character.race)} {lookupName(dnd?.classes ?? [], character.class)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {isOwnProfile &&
                  <Link className='profile__characters-create' to={ROUTES.characterNew}>
                    {t('character:list.create')}
                  </Link>
                }
              </div>
            </div>

            {isOwnProfile &&
              <div className='profile__reservations'>
                <div className='profile__reservations-info'>
                  <h2 className='profile__reservations-title'>
                    {t('profile:reservations.title')}
                  </h2>

                  {!myReservations || myReservations.length === 0 ? (
                    <p className='profile__reservations-empty'>
                      {t('profile:reservations.empty')}
                    </p>
                  ) : (
                    <ul className='profile__reservations-list'>
                      {myReservations.map((reservation) => (
                        <li key={reservation.id}>
                          <button
                            type='button'
                            className='profile__reservations-link'
                            onClick={() => setSelectedReservation(reservation)}
                          >
                            <span className='profile__reservations-date'>
                              {formatDateTime(reservation.startsAt)}
                            </span>
                            <span className='profile__reservations-meta'>
                              {t('profile:reservations.tableMeta', {
                                number: reservation.table.number,
                                zone: reservation.table.zone,
                              })}
                            </span>
                            <span className='profile__reservations-meta'>
                              {t('reservation:confirm.guests', { count: reservation.guests })} · {reservation.totalAmount} ₽
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            }

            <ReservationDetailModal
              reservation={selectedReservation}
              isOpen={selectedReservation !== null}
              onClose={() => setSelectedReservation(null)}
            />
          </div>

          <div className='profile__info'>
            <h1 className='profile__name'>
              {data.firstName} {data.secondName}
            </h1>
            <p className='profile__joined'>
              {t('profile:joinedSince', { date: formatDateTime(data.createdAt) })}
            </p>

            {typeof data.bonuses === 'number' &&
              <p className='profile__bonuses'>
                {t('profile:bonuses')} <strong>{data.bonuses}</strong>
              </p>
            }

            {data.achievements && data.achievements.length > 0 &&
              <div className='profile__achievements'>
                <h2 className='profile__achievements-title'>
                  {t('profile:achievements.title')}
                </h2>
                
                <ul className='profile__achievements-list'>
                  {data.achievements.map((achievement) => (
                    <li key={achievement.id} className={`profile__achievements-item profile__achievements-item--${achievement.rarity[0].toLowerCase()}`}>
                      {i18n.language === 'en' ? achievement.nameEn : achievement.nameRu}
                    </li>
                  ))}
                </ul>
              </div>
            }

            {!isOwnProfile ? (
              data.bio &&
                <p className='profile__bio'>
                  {data.bio}
                </p>
            ) : (
              <>
                <div className='profile__divider' />

                <button
                  className='profile__password-button'
                  type='button'
                  onClick={() => setPasswordModalOpen(true)}
                >
                  {t('profile:password.open')}
                </button>

                <ChangePasswordModal isOpen={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />

                <form className='profile__form' onSubmit={handleSubmit((values) => update.mutate(values))}>
                  <div className='profile__field'>
                    {t('common:fields.image')}
                    <Controller
                      name='image'
                      control={control}
                      render={({ field }) => (
                        <ImageDropzone
                          value={field.value ? [field.value] : []}
                          onChange={(urls) => field.onChange(urls[0] ?? '')}
                          error={errors.image?.message}
                        />
                      )}
                    />
                  </div>

                  {FIELD_KEYS.map((key) => (
                    <label key={key} className='profile__field'>
                      {t(`common:fields.${key}`)}
                      {key === 'phone' ? (
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
                      ) : key === 'bio' ? (
                        <div className='input-parchment-wrapper'>
                          <textarea className='profile__textarea' {...register(key)} />
                        </div>
                      ) : (
                        <div className='input-parchment-wrapper'>
                          <input {...register(key)} />
                        </div>
                      )}
                      {errors[key] &&
                        <span className='profile__error'>
                          {errors[key]?.message}
                        </span>
                      }
                    </label>
                  ))}

                  <div className='profile__actions'>
                    <button className='profile__submit' type='submit' disabled={update.isPending}>
                      {update.isPending ? <Loader width='30px' height='30px' /> : t('common:actions.save')}
                    </button>

                    <button
                      className='profile__logout'
                      type='button'
                      disabled={logout.isPending}
                      onClick={() => logout.mutate(undefined, {
                        onSettled: () => navigate(ROUTES.home),
                      })}
                    >
                      {t('common:actions.logout')}
                    </button>
                  </div>

                  {update.isError &&
                    <p className='profile__status profile__status--error' role='alert'>
                      {getApiErrorMessage(update.error, t)}
                    </p>
                  }

                  {update.isSuccess &&
                    <p className='profile__status profile__status--success' role='status'>
                      {t('common:actions.saved')}
                    </p>
                  }
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
