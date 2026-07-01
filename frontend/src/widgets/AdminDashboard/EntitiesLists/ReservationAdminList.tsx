import {
  useAdminReservations, useReservationOptions,
  useCreateReservationAdmin, useUpdateReservationAdmin, useDeleteReservationAdmin,
  reservationFormSchema, type CreateReservationAdmin,
  type ReservationFull, type ReservationAdminOptions,
} from '@/entities/Reservation'
import { AdminModal, Dropdown, DateTimeField } from '@/shared/ui'
import { formatReadOnlyValue } from '@/shared/lib/datetime'
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

const EMPTY_RESERVATION: CreateReservationAdmin = {
  userId: '',
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

const toForm = (item: ReservationFull): CreateReservationAdmin => ({
  userId: item.userId,
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
  const { data, isLoading, isError } = useAdminReservations()
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
    if (editItem) {
      update.mutate({ id: editItem.id, ...values }, { onSuccess: close })
    } else {
      create.mutate(values, { onSuccess: close })
    }
  }

  const removeCurrent = () => {
    if (editItem) del.mutate(editItem.id, { onSuccess: close })
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
        Создать бронь
      </button>

      {data.map((item) => (
        <div key={item.id} onClick={() => openEdit(item)}>
          <p><strong>Стол {item.table.number} — {item.user.email}</strong></p>
        </div>
      ))}

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
  const { register, control, formState: { errors } } = useFormContext<CreateReservationAdmin>()

  const userOptions = (options?.users ?? []).map((u) => ({
    value: u.id,
    label: `${u.firstName} ${u.secondName} (${u.email})`,
  }))
  const tableOptions = (options?.tables ?? []).map((t) => ({
    value: t.id,
    label: `Стол ${t.number} — ${t.zoneNameRu}`,
  }))

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

      <Controller name="userId" control={control} render={({ field }) => (
        <Dropdown label="Пользователь" value={field.value} options={userOptions}
          onChange={field.onChange} error={errors.userId?.message} />
      )} />

      <Controller name="tableId" control={control} render={({ field }) => (
        <Dropdown label="Стол" value={field.value} options={tableOptions}
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

      <label>
        Гостей
        <input type="number" {...register('guests')} />
        {errors.guests &&
          <span className="news-form__error">
            {errors.guests.message}
          </span>
        }
      </label>

      <Controller name="status" control={control} render={({ field }) => (
        <Dropdown label="Статус" value={field.value} options={STATUS_OPTIONS}
          onChange={field.onChange} error={errors.status?.message} />
      )} />

      <label>
        Сумма
        <input type="number" {...register('totalAmount')} />
        {errors.totalAmount &&
            <span className="news-form__error">
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
    <div className="dish-lines">
      <Dropdown
        label="Блюда"
        value={null}
        placeholder="Добавить блюдо"
        options={addOptions}
        onChange={(dishId) => append({ dishId, quantity: 1 })}
      />

      {fields.map((field, index) => (
        <div key={field.id} className="dish-lines__row">
          <span>{nameById(field.dishId)}</span>

          <input type="number" min={1} max={10} {...register(`dishes.${index}.quantity`)} />
          
          <button type="button" onClick={() => remove(index)}>X</button>
          {errors.dishes?.[index]?.quantity && (
            <span className="news-form__error">
              {errors.dishes[index]?.quantity?.message}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export default ReservationAdminList
