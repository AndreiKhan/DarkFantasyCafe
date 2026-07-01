import {
  useAdminUsers, useCreateUser, useUpdateUser, useDeleteUser,
  userFormSchema, type CreateUser, type UserFull,
} from '@/entities/User'
import { useAdminReservations, type ReservationFull } from '@/entities/Reservation'
import { AdminModal, Dropdown } from '@/shared/ui'
import { formatDateTime, formatReadOnlyValue } from '@/shared/lib/datetime'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

const EMPTY_USER: CreateUser = {
  email: '',
  password: '',
  firstName: '',
  secondName: '',
  phone: '',
  image: '',
  role: 'USER',
}

const ROLE_OPTIONS = [
  { value: 'USER', label: 'USER' },
  { value: 'ADMIN', label: 'ADMIN' },
]

const toForm = (item: UserFull): CreateUser => ({
  email: item.email,
  password: '',
  firstName: item.firstName,
  secondName: item.secondName,
  phone: item.phone,
  image: item.image ?? '',
  role: item.role,
})

function UserAdminList() {
  const { data, isLoading, isError } = useAdminUsers()
  const { data: reservations } = useAdminReservations()
  const create = useCreateUser()
  const update = useUpdateUser()
  const del = useDeleteUser()

  const methods = useForm<CreateUser>({
    resolver: zodResolver(userFormSchema),
    defaultValues: EMPTY_USER,
  })

  const [editItem, setEditItem] = useState<UserFull | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [removedTokenIds, setRemovedTokenIds] = useState<string[]>([])

  const close = () => setIsOpen(false)

  const resetMutations = () => {
    create.reset()
    update.reset()
    del.reset()
  }

  const openCreate = () => {
    resetMutations()
    setRemovedTokenIds([])
    setEditItem(null)
    methods.reset(EMPTY_USER)
    setIsOpen(true)
  }

  const openEdit = (item: UserFull) => {
    resetMutations()
    setRemovedTokenIds([])
    setEditItem(item)
    methods.reset(toForm(item))
    setIsOpen(true)
  }

  const removeCurrent = () => {
    if (editItem) del.mutate(editItem.id, { onSuccess: close })
  }

  const onValid = (values: CreateUser) => {
    if (editItem) {
      const { password, ...rest } = values

      update.mutate(
        { id: editItem.id, ...rest, removeRefreshTokenIds: removedTokenIds },
        { onSuccess: close },
      )

    } else {
      create.mutate(values, { onSuccess: close })
    }
  }

  if (isLoading) {
    return <p>isLoading</p>
  }
  if (isError || !data) {
    return <p>isError</p>
  }

  return (
    <div>
      <button type="button" onClick={openCreate}>
        Создать пользователя
      </button>

      {data.map((item) => (
        <div key={item.id} onClick={() => openEdit(item)}>
          <p><strong>{item.email}</strong></p>
        </div>
      ))}

      <AdminModal
        title={editItem ? 'Редактировать пользователя' : 'Новый пользователь'}
        isOpen={isOpen}
        onClose={close}
        onSave={methods.handleSubmit(onValid)}
        onRemove={editItem ? removeCurrent : undefined}
        error={(create.error ?? update.error ?? del.error)?.message}
      >
        <FormProvider {...methods}>
          <UserForm
            meta={editItem}
            reservations={editItem ? (reservations ?? []).filter((r) => r.userId === editItem!.id) : []}
            removedTokenIds={removedTokenIds}
            onRemoveToken={(tokenId) => setRemovedTokenIds((prev) => [...prev, tokenId])}
          />
        </FormProvider>
      </AdminModal>
    </div>
  )
}

function UserForm({ meta, reservations, removedTokenIds, onRemoveToken }: {
  meta: UserFull | null
  reservations: ReservationFull[]
  removedTokenIds: string[]
  onRemoveToken: (id: string) => void
}) {
  const { register, control, formState: { errors } } = useFormContext<CreateUser>()

  const texts: [keyof CreateUser, string][] = [
    ['email', 'Email'],
    ['firstName', 'Имя'],
    ['secondName', 'Фамилия'],
    ['phone', 'Телефон'],
    ['image', 'Изображение (URL)'],
  ]

  const readOnly: [keyof UserFull, string][] = [
    ['id', 'ID'],
    ['createdAt', 'Создано'],
    ['updatedAt', 'Обновлено'],
  ]

  return (
    <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
      {meta && (
        <div className="news-form__readonly">
          {readOnly.map(([key, label]) => (
            <p key={key}>
              <strong>{label}:</strong> {formatReadOnlyValue(key, meta[key])}
            </p>
          ))}
        </div>
      )}

      {meta && (
        <div>
          <span>Бронирования:</span>
          {reservations.length === 0 && <p>—</p>}
          {reservations.map((r) => (
            <div key={r.id} className="news-form__readonly">
              <p><strong>Стол:</strong> {r.table.number}</p>
              <p><strong>Начало:</strong> {formatDateTime(r.startsAt)}</p>
              <p><strong>Конец:</strong> {formatDateTime(r.endsAt)}</p>
              <p><strong>Статус:</strong> {r.status}</p>
              <p><strong>Сумма:</strong> {r.totalAmount} ₽</p>
            </div>
          ))}
        </div>
      )}

      {meta && (
        <div>
          <span>Сессии (refresh-токены):</span>
          {meta.refreshTokens
            .filter((token) => !removedTokenIds.includes(token.id))
            .map((token) => (
              <div key={token.id} className="news-form__readonly">
                <p><strong>Выдан:</strong> {formatDateTime(token.createdAt)}</p>
                <p><strong>Истекает:</strong> {formatDateTime(token.expiresAt)}</p>
                <button type="button" onClick={() => onRemoveToken(token.id)}>X</button>
              </div>
            ))}
          {meta.refreshTokens.every((token) => removedTokenIds.includes(token.id)) && <p>—</p>}
        </div>
      )}

      {texts.map(([key, label]) => (
        <label key={key}>
          {label}
          <input {...register(key)} />
          {errors[key] &&
            <span className="news-form__error">
              {errors[key]?.message}
            </span>
          }
        </label>
      ))}

      {!meta && (
        <label>
          Пароль
          <input type="password" {...register('password')} />
          {errors.password &&
            <span className="news-form__error">
              {errors.password.message}
            </span>
          }
        </label>
      )}

      <Controller name="role" control={control} render={({ field }) => (
        <Dropdown label="Роль" value={field.value} options={ROLE_OPTIONS}
          onChange={field.onChange} error={errors.role?.message} />
      )} />
    </div>
  )
}

export default UserAdminList
