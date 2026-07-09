import {
  useAdminUsers, useCreateUser, useUpdateUser, useDeleteUser,
  userFormSchema, type CreateUser, type UserFull,
} from '@/entities/User'
import { useAdminReservations, type ReservationFull } from '@/entities/Reservation'
import { AdminModal, AdminTable, Dropdown, PhoneInput, ImageDropzone, type AdminTableColumn, Loader, ErrorPlug } from '@/shared/ui'
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
  bio: '',
  role: 'USER',
}

const ROLE_OPTIONS = [
  { value: 'USER', label: 'USER' },
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'MASTER', label: 'MASTER' },
]

const COLUMNS: AdminTableColumn<UserFull>[] = [
  { key: 'email', header: 'Email', render: (item) => item.email },
  { key: 'name', header: 'Имя', render: (item) => `${item.firstName} ${item.secondName}` },
  { key: 'phone', header: 'Телефон', render: (item) => item.phone ?? '—' },
  { key: 'role', header: 'Роль', render: (item) => <span className='admin-table__badge'>{item.role}</span> },
]

const toForm = (item: UserFull): CreateUser => ({
  email: item.email,
  password: '',
  firstName: item.firstName,
  secondName: item.secondName,
  phone: item.phone ?? '',
  image: item.image ?? '',
  bio: item.bio ?? '',
  role: item.role,
})

function UserAdminList() {
  const [query, setQuery] = useState('')
  const { data, isLoading, isError } = useAdminUsers(query)
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
      const { password: _password, ...rest } = values

      update.mutate(
        { id: editItem.id, ...rest, removeRefreshTokenIds: removedTokenIds },
        { onSuccess: close },
      )

    } else {
      if (!values.password) {
        methods.setError('password', { message: 'Минимум 8 символов' })
        return
      }
      create.mutate(values, { onSuccess: close })
    }
  }

  if (isLoading) {
    return <Loader width='100px' height='100px' />
  }
  if (isError || !data) {
    return <ErrorPlug />
  }

  return (
    <div className='user-entity'>
      <AdminTable
        columns={COLUMNS}
        data={data}
        getRowKey={(item) => item.id}
        onRowClick={openEdit}
        onCreate={openCreate}
        createLabel='Создать пользователя'
        searchPlaceholder='Email, имя, телефон, bio...'
        onSearch={setQuery}
      />

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
    ['bio', 'О себе'],
  ]

  const readOnly: [keyof UserFull, string][] = [
    ['id', 'ID'],
    ['createdAt', 'Создано'],
    ['updatedAt', 'Обновлено'],
  ]

  return (
    <div className='admin-form'>
      {meta && (
        <div className='admin-form__readonly'>
          {readOnly.map(([key, label]) => (
            <p key={key}>
              <strong>{label}:</strong> {formatReadOnlyValue(key, meta[key])}
            </p>
          ))}
        </div>
      )}

      {meta && (
        <div className='admin-form__section'>
          <span className='admin-form__section-title'>Бронирования:</span>
          <div className='admin-form__wrapper'>
            {reservations.length === 0 && <p>—</p>}
            {reservations.map((r) => (
              <div key={r.id} className='admin-form__readonly'>
                <p><strong>Стол:</strong> {r.table.number}</p>
                <p><strong>Начало:</strong> {formatDateTime(r.startsAt)}</p>
                <p><strong>Конец:</strong> {formatDateTime(r.endsAt)}</p>
                <p><strong>Статус:</strong> {r.status}</p>
                <p><strong>Сумма:</strong> {r.totalAmount} ₽</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {meta && (
        <div className='admin-form__section'>
          <span className='admin-form__section-title'>Сессии (refresh-токены):</span>
          <div className='admin-form__wrapper'>
            {meta.refreshTokens.every((token) => removedTokenIds.includes(token.id)) && <p>—</p>}
            {meta.refreshTokens
              .filter((token) => !removedTokenIds.includes(token.id))
              .map((token) => (
                <div key={token.id} className='admin-form__readonly admin-form__readonly--row'>
                  <p><strong>Выдан:</strong> {formatDateTime(token.createdAt)}</p>
                  <p><strong>Истекает:</strong> {formatDateTime(token.expiresAt)}</p>
                  <button
                    type='button'
                    className='admin-modal__button admin-modal__button--danger'
                    onClick={() => onRemoveToken(token.id)}
                  >
                    X
                  </button>
                </div>
            ))}
          </div>
        </div>
      )}

      {meta && (
        <div className='admin-form__section'>
          <span className='admin-form__section-title'>Персонажи:</span>
          <div className='admin-form__wrapper'>
            {meta.characters.length === 0 && <p>—</p>}
            {meta.characters.map((character) => (
              <div key={character.id} className='admin-form__readonly'>
                <p><strong>Имя:</strong> {character.name}</p>
                <p><strong>Уровень:</strong> {character.level}</p>
                <p><strong>Класс:</strong> {character.class}</p>
                <p><strong>Раса:</strong> {character.race}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {meta && (
        <div className='admin-form__section'>
          <span className='admin-form__section-title'>Достижения:</span>
          <div className='admin-form__wrapper'>
            {meta.achievements.length === 0 && <p>—</p>}
            {meta.achievements.map((achievement) => (
              <div key={achievement.id} className='admin-form__readonly'>
                <p><strong>Название:</strong> {achievement.nameRu}</p>
                <p><strong>Статус:</strong> {achievement.status}</p>
                <p><strong>Бонусы:</strong> {achievement.bonuses}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Controller name='image' control={control} render={({ field }) => (
        <ImageDropzone
          label='Изображение'
          value={field.value ? [field.value] : []}
          onChange={(urls) => field.onChange(urls[0] ?? '')}
          error={errors.image?.message}
        />
      )} />

      {texts.map(([key, label]) => (
        <label key={key} className='admin-form__field'>
          {label}
          {key === 'phone' ? (
            <Controller
              name='phone'
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
            <span className='admin-form__error'>
              {errors[key]?.message}
            </span>
          }
        </label>
      ))}

      {!meta && (
        <label className='admin-form__field'>
          Пароль
          <input type='password' {...register('password')} />
          {errors.password &&
            <span className='admin-form__error'>
              {errors.password.message}
            </span>
          }
        </label>
      )}

      <Controller name='role' control={control} render={({ field }) => (
        <Dropdown label='Роль' value={field.value} options={ROLE_OPTIONS}
          onChange={field.onChange} error={errors.role?.message} />
      )} />
    </div>
  )
}

export default UserAdminList
