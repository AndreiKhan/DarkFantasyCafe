import {
  useAdminNews, useCreateNews, useUpdateNews, useDeleteNews,
  newsFormSchema, type CreateNews, type NewsFull,
} from '@/entities/News'
import { AdminModal, AdminTable, Dropdown, ImageDropzone, DateTimeField, type AdminTableColumn, ErrorPlug, Loader } from '@/shared/ui'
import { slugify } from '@/shared/lib/slugify'
import { formatReadOnlyValue } from '@/shared/lib/datetime'
import { useEffect, useRef, useState } from 'react'
import { useForm, Controller, FormProvider, useFormContext, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const EMPTY_NEWS: CreateNews = {
  slug: '',
  type: 'NEWS',
  status: 'DRAFT',
  titleRu: '',
  titleEn: '',
  shortDescriptionRu: '',
  shortDescriptionEn: '',
  bodyRu: '',
  bodyEn: '',
  images: [],
  startsAt: null,
  endsAt: null,
}

const TYPE_OPTIONS = [
  { value: 'NEWS', label: 'NEWS' },
  { value: 'PERFORMANCE', label: 'PERFORMANCE' },
  { value: 'MONSTER', label: 'MONSTER' },
]

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'DRAFT' },
  { value: 'PUBLISHED', label: 'PUBLISHED' },
  { value: 'ARCHIVED', label: 'ARCHIVED' },
]

const COLUMNS: AdminTableColumn<NewsFull>[] = [
  { key: 'title', header: 'Заголовок', render: (item) => item.titleRu },
  { key: 'slug', header: 'Slug', render: (item) => item.slug },
  { key: 'type', header: 'Тип', render: (item) => <span className='admin-table__badge'>{item.type}</span> },
  { key: 'status', header: 'Статус', render: (item) => <span className='admin-table__badge'>{item.status}</span> },
]

const toForm = (item: NewsFull): CreateNews => ({
  slug: item.slug,
  type: item.type,
  status: item.status,
  titleRu: item.titleRu,
  titleEn: item.titleEn,
  shortDescriptionRu: item.shortDescriptionRu,
  shortDescriptionEn: item.shortDescriptionEn,
  bodyRu: item.bodyRu,
  bodyEn: item.bodyEn,
  images: item.images,
  startsAt: item.startsAt,
  endsAt: item.endsAt,
})

function NewsAdminList() {
  const [query, setQuery] = useState('')
  const { data, isLoading, isError } = useAdminNews(query)
  const create = useCreateNews()
  const update = useUpdateNews()
  const del = useDeleteNews()

  const methods = useForm<CreateNews>({
    resolver: zodResolver(newsFormSchema) as Resolver<CreateNews>,
    defaultValues: EMPTY_NEWS,
  })

  const [editItem, setEditItem] = useState<NewsFull | null>(null)
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
    methods.reset(EMPTY_NEWS)
    setIsOpen(true)
  }

  const openEdit = (item: NewsFull) => {
    resetMutations()
    setEditItem(item)
    methods.reset(toForm(item))
    setIsOpen(true)
  }

  const save = (values: CreateNews) => {
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
    return <Loader width='100px' height='100px' />
  }
  if (isError || !data) {
    return <ErrorPlug />
  }

  return (
    <div className='news-entity'>
      <AdminTable
        columns={COLUMNS}
        data={data}
        getRowKey={(item) => item.id}
        onRowClick={openEdit}
        onCreate={openCreate}
        createLabel='Создать новость'
        searchPlaceholder='Slug, заголовок, текст...'
        onSearch={setQuery}
      />

      <AdminModal
        title={editItem ? 'Редактировать новость' : 'Новая новость'}
        isOpen={isOpen}
        onClose={close}
        onSave={methods.handleSubmit(save)}
        onRemove={editItem ? removeCurrent : undefined}
        error={(create.error ?? update.error ?? del.error)?.message}
      >
        <FormProvider {...methods}>
          <NewsForm meta={editItem} />
        </FormProvider>
      </AdminModal>
    </div>
  )
}

function NewsForm({ meta }: { meta: NewsFull | null }) {
  const { register, control, setValue, formState: { errors } } = useFormContext<CreateNews>()

  const isCreate = !meta
  const slugTouched = useRef(false)
  const titleRu = useWatch({ control, name: 'titleRu' })

  useEffect(() => {
    if (isCreate && !slugTouched.current) {
      setValue('slug', slugify(titleRu ?? ''))
    }
  }, [titleRu, isCreate, setValue])

  const texts: [keyof CreateNews, string, boolean?][] = [
    ['titleRu', 'Заголовок (RU)'],
    ['titleEn', 'Заголовок (EN)'],
    ['shortDescriptionRu', 'Краткое описание (RU)'],
    ['shortDescriptionEn', 'Краткое описание (EN)'],
    ['bodyRu', 'Текст (RU)', true],
    ['bodyEn', 'Текст (EN)', true],
  ]

  const dates: ['startsAt' | 'endsAt', string][] = [
    ['startsAt', 'Начало'],
    ['endsAt', 'Конец'],
  ]

  const readOnly: [keyof NewsFull, string][] = [
    ['id', 'ID'],
    ['createdAt', 'Создано'],
    ['updatedAt', 'Обновлено'],
    ['publishedAt', 'Опубликовано'],
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

      <Controller name='type' control={control} render={({ field }) => (
        <Dropdown label='Тип' value={field.value} options={TYPE_OPTIONS}
          onChange={field.onChange} error={errors.type?.message} />
      )} />

      <Controller name='status' control={control} render={({ field }) => (
        <Dropdown label='Статус' value={field.value} options={STATUS_OPTIONS}
          onChange={field.onChange} error={errors.status?.message} />
      )} />

      <label className='admin-form__field'>
        Slug
        <input
          {...register('slug', {
            onChange: () => { slugTouched.current = true },
          })}
        />
        {errors.slug &&
          <span className='admin-form__error'>
            {errors.slug.message}
          </span>
        }
      </label>

      {texts.map(([key, label, area]) => (
        <label key={key} className='admin-form__field'>
          {label}
          {area ? <textarea {...register(key)} /> : <input {...register(key)} />}
          {errors[key] &&
            <span className='admin-form__error'>
              {errors[key]?.message}
            </span>
          }
        </label>
      ))}

      {dates.map(([key, label]) => (
        <Controller key={key} name={key} control={control} render={({ field }) => (
          <DateTimeField
            label={label}
            value={field.value}
            onChange={field.onChange}
            error={errors[key]?.message}
          />
        )} />
      ))}

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

export default NewsAdminList
