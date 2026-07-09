import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import SectionDecoratedTitle from '@/shared/ui/SectionDecoratedTitle/SectionDecoratedTitle'
import { useCreateContactRequest, createContactRequestFormSchema, type CreateContactRequest } from '@/entities/ContactRequest'
import { useMe } from '@/entities/Auth'
import { useTrackAchievement } from '@/entities/Achievement'
import { getApiErrorMessage } from '@/shared/lib/apiError'
import AddressIcon from '@/assets/svg/address.svg?react'
import PhoneIcon from '@/assets/svg/phone.svg?react'
import ClockIcon from '@/assets/svg/clock.svg?react'
import './WhereToFindUs.scss'

const YANDEX_MAP_EMBED_SRC = 'https://yandex.ru/map-widget/v1/?ll=37.617828%2C55.755478&z=16&pt=37.617828,55.755478,pm2rdm'


function WhereToFindUs() {
  const { t } = useTranslation(['whereToFindUs', 'errors'])
  const create = useCreateContactRequest()
  const { data: me } = useMe()
  const trackAchievement = useTrackAchievement()

  const resolver = useMemo(
    () => zodResolver(createContactRequestFormSchema(t)),
    [t],
  )

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateContactRequest>({
    resolver,
  })

  const onSubmit = (values: CreateContactRequest) => {
    create.mutate(values, {
      onSuccess: () => {
        reset()
        if (me) {
          trackAchievement.mutate('first_contact_request')
        }
      },
    })
  }

  return (
    <section className='where-to-find-us'>
      <div className='center'>
        <SectionDecoratedTitle title={t('title')} />
        <div className='where-to-find-us__content'>
          <div className='where-to-find-us__map-wrapper'>
            <div className='where-to-find-us__map'>
              <iframe
                className='where-to-find-us__map-yandex'
                src={YANDEX_MAP_EMBED_SRC}
                title={t('address')}
                loading='lazy'
              />
            </div>
          </div>
          <div className='where-to-find-us__info'>
            <h3 className='where-to-find-us__header'>
              {t('visitUs')}
            </h3>
            <div className='where-to-find-us__info-list'>
              <div className='where-to-find-us__item'>
                <div className='where-to-find-us__svg'>
                  <AddressIcon />
                </div>
                <div className='where-to-find-us__description'>
                  <h5 className='where-to-find-us__name'>
                    {t('address')}
                  </h5>
                  <p className='where-to-find-us__text'>
                    {t('addressValue')}
                  </p>
                </div>
              </div>
              <div className='where-to-find-us__item'>
                <div className='where-to-find-us__svg'>
                  <PhoneIcon />
                </div>
                <div className='where-to-find-us__description'>
                  <h5 className='where-to-find-us__name'>
                    {t('phone')}
                  </h5>
                  <p className='where-to-find-us__text'>
                    <a className='where-to-find-us__link' href='tel:+78005553535'>
                      8 800 555 35 35
                    </a>
                  </p>
                </div>
              </div>
              <div className='where-to-find-us__item'>
                <div className='where-to-find-us__svg'>
                  <ClockIcon />
                </div>
                <div className='where-to-find-us__description'>
                  <h5 className='where-to-find-us__name'>
                    {t('hours')}
                  </h5>
                  <p className='where-to-find-us__text'>
                    8:00 - 00:00
                  </p>
                </div>
              </div>
            </div>
            <div className='where-to-find-us__divider' />
            <h4 className='where-to-find-us__subtitle'>
              {t('leaveRequest')}
            </h4>
            <form className='where-to-find-us__contact-form' onSubmit={handleSubmit(onSubmit)}>
              <div className='input-parchment-wrapper'>
                <input
                  type='text'
                  className='where-to-find-us__input'
                  placeholder={t('contactPlaceholder')}
                  {...register('contact')}
                />
              </div>
              {errors.contact &&
                <span className='where-to-find-us__error' role='alert'>
                  {errors.contact.message}
                </span>
              }
              <div className='input-parchment-wrapper'>
                <textarea
                  className='where-to-find-us__textarea'
                  placeholder={t('messagePlaceholder')}
                  {...register('message')}
                />
              </div>
              {errors.message &&
                <span className='where-to-find-us__error' role='alert'>
                  {errors.message.message}
                </span>
              }
              {create.isError &&
                <p className='where-to-find-us__error' role='alert'>
                  {getApiErrorMessage(create.error, t)}
                </p>
              }
              {create.isSuccess &&
                <p className='where-to-find-us__success'>
                  {t('requestSent')}
                </p>
              }
              <button className='where-to-find-us__button' type='submit' disabled={create.isPending}>
                {t('sendRaven')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhereToFindUs
