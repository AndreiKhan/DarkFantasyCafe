import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { useMe } from '@/entities/Auth'
import { useProfile, useUpdateProfile, type UpdateProfileInput } from '@/entities/User'
import { PhoneInput } from '@/shared/ui'
const FIELDS: [keyof UpdateProfileInput, string][] = [
  ['firstName', 'Имя'],
  ['secondName', 'Фамилия'],
  ['email', 'Email'],
  ['phone', 'Телефон'],
  ['image', 'Изображение (URL)'],
  ['bio', 'О себе'],
]

function ProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const { data: me } = useMe()
  const { data, isLoading, isError } = useProfile(userId!)
  const update = useUpdateProfile(userId!)

  const isOwnProfile = me?.user.sub === userId

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
    return <p>isLoading</p>
  }
  if (isError || !data) {
    return <p>isError</p>
  }

  if (!isOwnProfile) {
    return (
      <section className="center">
        <h1>{data.firstName} {data.secondName}</h1>
        {data.image &&
          <img src={data.image} />
        }
        {data.bio && <p>{data.bio}</p>}
      </section>
    )
  }

  return (
    <section className="center">
      <h1>{data.firstName} {data.secondName}</h1>

      <form onSubmit={handleSubmit((values) => update.mutate(values))}>
        {FIELDS.map(([key, label]) => (
          <label key={key}>
            {label}
            {key === 'phone' ? (
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
            ) : (
              <input {...register(key)} />
            )}
            {errors[key] &&
              <span>{errors[key]?.message}</span>
            }
          </label>
        ))}
        <button type="submit" disabled={update.isPending}>
          {update.isPending ? 'Сохранение...' : 'Сохранить'}
        </button>

        {update.isError && <p>{update.error.message}</p>}
        {update.isSuccess && <p>Сохранено</p>}
      </form>
    </section>
  )
}

export default ProfilePage
