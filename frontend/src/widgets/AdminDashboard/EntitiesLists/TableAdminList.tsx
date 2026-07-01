import {
  useAdminTables,
  useTableZones,
  useCreateTable,
  useUpdateTable,
  useDeleteTable,
  tableFormSchema,
  type CreateTable,
  type TableFull,
  type TableAdminZones,
} from '@/entities/Table'
import { AdminModal, Dropdown } from '@/shared/ui'
import { formatReadOnlyValue } from '@/shared/lib/datetime'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

const EMPTY_TABLE: CreateTable = {
  number: 1,
  zoneId: '',
  capacity: 1,
  x: 0,
  y: 0,
  isActive: true,
}

const toForm = (item: TableFull): CreateTable => ({
  number: item.number,
  zoneId: item.zoneId,
  capacity: item.capacity,
  x: item.x,
  y: item.y,
  isActive: item.isActive,
})

function TableAdminList() {
  const { data, isLoading, isError } = useAdminTables()
  const { data: zones } = useTableZones()
  
  const create = useCreateTable()
  const update = useUpdateTable()
  const del = useDeleteTable()

  const methods = useForm<CreateTable>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: EMPTY_TABLE,
  })

  const [editItem, setEditItem] = useState<TableFull | null>(null)
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
    methods.reset(EMPTY_TABLE)
    setIsOpen(true)
  }

  const openEdit = (item: TableFull) => {
    resetMutations()
    setEditItem(item)
    methods.reset(toForm(item))
    setIsOpen(true)
  }

  const save = (values: CreateTable) => {
    if (editItem) {
      update.mutate({ id: editItem.id, ...values }, { onSuccess: close })
    } else {
      create.mutate(values, { onSuccess: close })
    }
  }

  const removeCurrent = () => {
    if (editItem) {
      del.mutate(editItem.id, { onSuccess: close })
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
        Создать столик
      </button>

      {data.map((item) => (
        <div
          key={item.id}
          onClick={() => openEdit(item)}
        >
          <p><strong>Стол {item.number} — {item.zone.nameRu}</strong></p>
        </div>
      ))}

      <AdminModal
        title={editItem ? 'Редактировать столик' : 'Новый столик'}
        isOpen={isOpen}
        onClose={close}
        onSave={methods.handleSubmit(save)}
        onRemove={editItem ? removeCurrent : undefined}
        error={(create.error ?? update.error ?? del.error)?.message}
      >
        <FormProvider {...methods}>
          <TableForm meta={editItem} options={zones} />
        </FormProvider>
      </AdminModal>
    </div>
  )
}

function TableForm({ meta, options }: { meta: TableFull | null; options?: TableAdminZones }) {
  const { register, control, formState: { errors } } = useFormContext<CreateTable>()

  const zoneOptions = (options?.zones ?? []).map((zone) => ({ value: zone.id, label: zone.nameRu }))

  const numbers: [keyof CreateTable, string][] = [
    ['number', 'Номер стола'],
    ['capacity', 'Вместимость'],
    ['x', 'Координата X'],
    ['y', 'Координата Y'],
  ]

  const readOnly: [keyof TableFull, string][] = [
    ['id', 'ID'],
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

      {numbers.map(([key, label]) => (
        <label key={key}>
          {label}
          <input type="number" {...register(key)} />
          {errors[key] &&
            <span className="news-form__error">
              {errors[key]?.message}
            </span>
          }
        </label>
      ))}

      <Controller name="zoneId" control={control} render={({ field }) => (
        <Dropdown label="Зона" value={field.value} options={zoneOptions}
          onChange={field.onChange} error={errors.zoneId?.message} />
      )} />

      <label>
        <input type="checkbox" {...register('isActive')} /> Активен (доступен для бронирования)
      </label>
    </div>
  )
}

export default TableAdminList
