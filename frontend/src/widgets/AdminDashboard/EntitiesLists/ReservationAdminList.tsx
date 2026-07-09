import {
  useAdminReservations, useReservationOptions, useMasters,
  useCreateReservationAdmin, useUpdateReservationAdmin, useDeleteReservationAdmin,
  reservationFormSchema, type CreateReservationAdmin,
  type ReservationFull, type ReservationAdminOptions,
} from '@/entities/Reservation'
import { AdminModal, AdminTable, Dropdown, DateTimeField, type AdminTableColumn, ErrorPlug, Loader } from '@/shared/ui'
import { formatDateTime, formatReadOnlyValue } from '@/shared/lib/datetime'
import { Controller, FormProvider, useFieldArray, useForm, useFormContext, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

const EMPTY_RESERVATION: CreateReservationAdmin = {
  userId: '',
  masterId: '',
  masterSessionType: '',
  tableId: '',
  startsAt: '',
  endsAt: '',
  guests: 1,
  status: 'DRAFT',
  totalAmount: 0,
  dishes: [],
}

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'DRAFT' },
  { value: 'PENDING_PAYMENT', label: 'PENDING_PAYMENT' },
  { value: 'CONFIRMED', label: 'CONFIRMED' },
  { value: 'CANCELLED', label: 'CANCELLED' },
]

const COLUMNS: AdminTableColumn<ReservationFull>[] = [
  { key: 'table', header: 'Стол', render: (item) => `№${item.table.number}` },
  { key: 'guest', header: 'Гость', render: (item) => `${item.user.firstName} ${item.user.secondName} (${item.user.email})` },
  { key: 'startsAt', header: 'Начало', render: (item) => formatDateTime(item.startsAt) },
  { key: 'totalAmount', header: 'Сумма', render: (item) => `${item.totalAmount} ₽` },
]

const toForm = (item: ReservationFull): CreateReservationAdmin => ({
  userId: item.userId,
  masterId: item.masterId ?? '',
  masterSessionType: item.masterSessionType ?? '',
  tableId: item.tableId,
  startsAt: item.startsAt,
  endsAt: item.endsAt,
  guests: item.guests,
  status: item.status,
  totalAmount: item.totalAmount,
  dishes: item.items
    .filter((line) => line.type === 'DISH' && line.dishId)
    .map((line) => ({ dishId: line.dishId as string, quantity: line.quantity })),
})

function ReservationAdminList() {
  const [query, setQuery] = useState('')
  const { data, isLoading, isError } = useAdminReservations(query)
  const { data: options } = useReservationOptions()
  const create = useCreateReservationAdmin()
  const update = useUpdateReservationAdmin()
  const del = useDeleteReservationAdmin()

  const methods = useForm<CreateReservationAdmin>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: EMPTY_RESERVATION,
  })

  const [editItem, setEditItem] = useState<ReservationFull | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const close = () => setIsOpen(false)

  const resetMutations = () => {
    create.reset()
    update.reset()
    del.reset()
  }

  const openCreate = () => {
    resetMutations()
    setEditItem(null)
    methods.reset(EMPTY_RESERVATION)
    setIsOpen(true)
  }

  const openEdit = (item: ReservationFull) => {
    resetMutations()
    setEditItem(item)
    methods.reset(toForm(item))
    setIsOpen(true)
  }

  const save = (values: CreateReservationAdmin) => {
    const payload = {
      ...values,
      masterId: values.masterId || null,
      masterSessionType: values.masterId && values.masterSessionType
        ? values.masterSessionType
        : null,
    }
    if (editItem) {
      update.mutate({ id: editItem.id, ...payload }, { onSuccess: close })
    } else {
      create.mutate(payload, { onSuccess: close })
    }
  }

  const removeCurrent = () => {
    if (editItem) del.mutate(editItem.id, { onSuccess: close })
  }

  if (isLoading) {
    return <Loader width='100px' height='100px' />
  }
  if (isError || !data) {
    return <ErrorPlug />
  }

  return (
    <div className='reservation-entity'>
      <AdminTable
        columns={COLUMNS}
        data={data}
        getRowKey={(item) => item.id}
        onRowClick={openEdit}
        onCreate={openCreate}
        createLabel='Создать бронь'
        searchPlaceholder='Email/имя гостя или номер стола...'
        onSearch={setQuery}
      />

      <AdminModal
        title={editItem ? 'Редактировать бронь' : 'Новая бронь'}
        isOpen={isOpen}
        onClose={close}
        onSave={methods.handleSubmit(save)}
        onRemove={editItem ? removeCurrent : undefined}
        error={(create.error ?? update.error ?? del.error)?.message}
      >
        <FormProvider {...methods}>
          <ReservationForm meta={editItem} options={options} />
        </FormProvider>
      </AdminModal>
    </div>
  )
}

function ReservationForm({ meta, options }: { meta: ReservationFull | null; options?: ReservationAdminOptions }) {
  const { register, control, setValue, formState: { errors } } = useFormContext<CreateReservationAdmin>()

  const startsAt = useWatch({ control, name: 'startsAt' })
  const endsAt = useWatch({ control, name: 'endsAt' })
  const masterId = useWatch({ control, name: 'masterId' })
  const { data: mastersData } = useMasters(
    { startsAt, endsAt, excludeId: meta?.id },
    Boolean(startsAt && endsAt),
  )
  const masters = mastersData?.masters ?? []
  const prices = mastersData?.prices

  const sessionOptions = prices
    ? [
        { value: 'ONESHOT', label: `Короткая (oneshot) — ${prices.oneshot} ₽` },
        { value: 'CAMPAIGN', label: `Длинная (кампания) — ${prices.campaign} ₽` },
      ]
    : []

  const userOptions = (options?.users ?? []).map((u) => ({
    value: u.id,
    label: `${u.firstName} ${u.secondName} (${u.email})`,
  }))
  const tableOptions = (options?.tables ?? []).map((t) => ({
    value: t.id,
    label: `Стол ${t.number} — ${t.zoneNameRu}`,
  }))
  const masterOptions = [
    { value: '', label: 'Без мастера' },
    ...masters
      .filter((master) => master.available)
      .map((master) => ({ value: master.id, label: master.name })),
  ]

  const dates: [keyof CreateReservationAdmin, string][] = [
    ['startsAt', 'Начало'],
    ['endsAt', 'Конец'],
  ]

  const readOnly: [keyof ReservationFull, string][] = [
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

      <Controller name='userId' control={control} render={({ field }) => (
        <Dropdown label='Пользователь' value={field.value} options={userOptions}
          onChange={field.onChange} error={errors.userId?.message} />
      )} />

      <Controller name='tableId' control={control} render={({ field }) => (
        <Dropdown label='Стол' value={field.value} options={tableOptions}
          onChange={field.onChange} error={errors.tableId?.message} />
      )} />

      {dates.map(([key, label]) => (
        <Controller key={key} name={key} control={control} render={({ field }) => (
          <DateTimeField
            label={label}
            value={field.value as string}
            onChange={(iso) => field.onChange(iso ?? '')}
            error={errors[key]?.message}
          />
        )} />
      ))}

      <Controller name='masterId' control={control} render={({ field }) => (
        <Dropdown label='Мастер' value={field.value || ''} options={masterOptions}
          onChange={(value) => {
            field.onChange(value)
            if (!value) setValue('masterSessionType', '')
          }}
          error={errors.masterId?.message} />
      )} />

      {masterId && (
        <Controller name='masterSessionType' control={control} render={({ field }) => (
          <Dropdown label='Тип истории' value={field.value || ''} options={sessionOptions}
            onChange={field.onChange} error={errors.masterSessionType?.message} />
        )} />
      )}

      <label className='admin-form__field'>
        Гостей
        <input type='number' {...register('guests')} />
        {errors.guests &&
          <span className='admin-form__error'>
            {errors.guests.message}
          </span>
        }
      </label>

      <Controller name='status' control={control} render={({ field }) => (
        <Dropdown label='Статус' value={field.value} options={STATUS_OPTIONS}
          onChange={field.onChange} error={errors.status?.message} />
      )} />

      <label className='admin-form__field'>
        Сумма
        <input type='number' {...register('totalAmount')} />
        {errors.totalAmount &&
            <span className='admin-form__error'>
              {errors.totalAmount.message}
            </span>
          }
      </label>

      <DishLines options={options} />
    </div>
  )
}

function DishLines({ options }: { options?: ReservationAdminOptions }) {
  const { control, register, formState: { errors } } = useFormContext<CreateReservationAdmin>()
  const { fields, append, remove } = useFieldArray({ control, name: 'dishes' })

  const dishes = options?.dishes ?? []
  const selectedIds = new Set(fields.map((f) => f.dishId))

  const addOptions = dishes
    .filter((dish) => !selectedIds.has(dish.id))
    .map((dish) => ({ value: dish.id, label: `${dish.nameRu} — ${dish.price} ₽` }))

  const nameById = (id: string) => dishes.find((dish) => dish.id === id)?.nameRu ?? id

  return (
    <div className='dish-lines'>
      <Dropdown
        label='Блюда'
        value={null}
        placeholder='Добавить блюдо'
        options={addOptions}
        onChange={(dishId) => append({ dishId, quantity: 1 })}
      />

      {fields.map((field, index) => (
        <div key={field.id} className='dish-lines__row'>
          <span>{nameById(field.dishId)}</span>

          <input type='number' min={1} max={10} {...register(`dishes.${index}.quantity`)} />

          <button
            type='button'
            className='admin-modal__button admin-modal__button--danger'
            onClick={() => remove(index)}
          >
            X
          </button>
          {errors.dishes?.[index]?.quantity && (
            <span className='admin-form__error'>
              {errors.dishes[index]?.quantity?.message}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export default ReservationAdminList
