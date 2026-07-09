import {
  useAdminDishes, useDishOptions, useCreateDish, useUpdateDish, useDeleteDish,
  dishFormSchema, type CreateDish, type DishFull, type DishAdminOptions,
} from '@/entities/Dish'
import { AdminModal, AdminTable, Dropdown, ErrorPlug, ImageDropzone, Loader, type AdminTableColumn } from '@/shared/ui'
import { formatReadOnlyValue } from '@/shared/lib/datetime'
import { Controller, FormProvider, useFormContext, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

const EMPTY_DISH: CreateDish = {
  nameRu: '',
  nameEn: '',
  descriptionRu: '',
  descriptionEn: '',
  price: 0,
  images: [],
  categoryId: '',
  tagIds: [],
  allergenIds: [],
}

const COLUMNS: AdminTableColumn<DishFull>[] = [
  { key: 'name', header: 'Название', render: (item) => item.nameRu },
  { key: 'category', header: 'Категория', render: (item) => item.category.nameRu },
  { key: 'price', header: 'Цена', render: (item) => `${item.price} ₽` },
  {
    key: 'allergens',
    header: 'Аллергены',
    render: (item) => item.allergens.length > 0
      ? item.allergens.map((allergen) => allergen.nameRu).join(', ')
      : '—',
  },
]

const toForm = (item: DishFull): CreateDish => ({
  nameRu: item.nameRu,
  nameEn: item.nameEn,
  descriptionRu: item.descriptionRu,
  descriptionEn: item.descriptionEn,
  price: item.price,
  images: item.images,
  categoryId: item.categoryId,
  tagIds: item.tags.map((tag) => tag.id),
  allergenIds: item.allergens.map((allergen) => allergen.id),
})

function DishAdminList() {
  const [query, setQuery] = useState('')
  const { data, isLoading, isError } = useAdminDishes(query)
  const { data: options } = useDishOptions()
  const create = useCreateDish()
  const update = useUpdateDish()
  const del = useDeleteDish()

  const methods = useForm<CreateDish>({
    resolver: zodResolver(dishFormSchema) as Resolver<CreateDish>,
    defaultValues: EMPTY_DISH,
  })

  const [editItem, setEditItem] = useState<DishFull | null>(null)
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
    methods.reset(EMPTY_DISH)
    setIsOpen(true)
  }

  const openEdit = (item: DishFull) => {
    resetMutations()
    setEditItem(item)
    methods.reset(toForm(item))
    setIsOpen(true)
  }

  const save = (values: CreateDish) => {
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
    return <Loader width='100px' height='100px' />
  }
  if (isError || !data) {
    return <ErrorPlug />
  }

  return (
    <div className='dish-entity'>
      <AdminTable
        columns={COLUMNS}
        data={data}
        getRowKey={(item) => item.id}
        onRowClick={openEdit}
        onCreate={openCreate}
        createLabel='Создать блюдо'
        searchPlaceholder='Название, описание...'
        onSearch={setQuery}
      />

      <AdminModal
        title={editItem ? 'Редактировать блюдо' : 'Новое блюдо'}
        isOpen={isOpen}
        onClose={close}
        onSave={methods.handleSubmit(save)}
        onRemove={editItem ? removeCurrent : undefined}
        error={(create.error ?? update.error ?? del.error)?.message}
      >
        <FormProvider {...methods}>
          <DishForm meta={editItem} options={options} />
        </FormProvider>
      </AdminModal>
    </div>
  )
}

function MultiCheck({ label, options, value, onChange }: {
  label: string
  options: { value: string; label: string }[]
  value: string[]
  onChange: (value: string[]) => void
}) {
  const toggle = (id: string) =>
    value.includes(id) ? onChange(value.filter((v) => v !== id)) : onChange([...value, id])

  return (
    <div className='admin-form__multi-check'>
      <span className='admin-form__section-title'>{label}</span>
      <div className='admin-form__multi-check-options'>
        {options.map((option) => (
          <label key={option.value} className='admin-form__multi-check-option'>
            <input
              type='checkbox'
              checked={value.includes(option.value)}
              onChange={() => toggle(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  )
}

function DishForm({ meta, options }: { meta: DishFull | null; options?: DishAdminOptions }) {
  const { register, control, formState: { errors } } = useFormContext<CreateDish>()

  const categoryOptions = (options?.categories ?? []).map((c) => ({ value: c.id, label: c.nameRu }))
  const tagOptions = (options?.tags ?? []).map((t) => ({ value: t.id, label: t.nameRu }))
  const allergenOptions = (options?.allergens ?? []).map((a) => ({ value: a.id, label: a.nameRu }))

  const texts: [keyof CreateDish, string, boolean?][] = [
    ['nameRu', 'Название (RU)'],
    ['nameEn', 'Название (EN)'],
    ['descriptionRu', 'Описание (RU)', true],
    ['descriptionEn', 'Описание (EN)', true],
  ]

  const readOnly: [keyof DishFull, string][] = [
    ['id', 'ID'],
    ['createdAt', 'Создано'],
    ['updatedAt', 'Обновлено'],
    ['deletedAt', 'Удалено'],
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

      {texts.map(([key, label, area]) => (
        <label key={key} className='admin-form__field'>
          {label}
          {area ? <textarea {...register(key)} /> : <input {...register(key)} />}
          {errors[key] && <span className='admin-form__error'>{errors[key]?.message}</span>}
        </label>
      ))}

      <label className='admin-form__field'>
        Цена
        <input type='number' {...register('price')} />
        {errors.price &&
          <span className='admin-form__error'>
            {errors.price.message}
          </span>
        }
      </label>

      <Controller name='categoryId' control={control} render={({ field }) => (
        <Dropdown label='Категория' value={field.value} options={categoryOptions}
          onChange={field.onChange} error={errors.categoryId?.message} />
      )} />

      <Controller name='tagIds' control={control} render={({ field }) => (
        <MultiCheck label='Теги' options={tagOptions} value={field.value} onChange={field.onChange} />
      )} />

      <Controller name='allergenIds' control={control} render={({ field }) => (
        <MultiCheck label='Аллергены' options={allergenOptions} value={field.value} onChange={field.onChange} />
      )} />

      <Controller name='images' control={control} render={({ field }) => (
        <ImageDropzone
          label='Изображения'
          value={field.value}
          onChange={field.onChange}
          multiple
          error={errors.images?.message}
        />
      )} />
    </div>
  )
}

export default DishAdminList
