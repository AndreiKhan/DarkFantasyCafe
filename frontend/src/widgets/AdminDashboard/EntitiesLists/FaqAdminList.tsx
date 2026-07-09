import {
  useAdminFaq, useCreateFaq, useUpdateFaq, useDeleteFaq,
  faqFormSchema, type CreateFaq, type FaqFull,
} from '@/entities/Faq'
import { AdminModal, AdminTable, ErrorPlug, Loader, type AdminTableColumn } from '@/shared/ui'
import { formatReadOnlyValue } from '@/shared/lib/datetime'
import { useState } from 'react'
import { useForm, FormProvider, useFormContext, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const EMPTY_FAQ: CreateFaq = {
  titleRu: '',
  titleEn: '',
  descriptionRu: '',
  descriptionEn: '',
}

const COLUMNS: AdminTableColumn<FaqFull>[] = [
  { key: 'title', header: 'Вопрос', render: (item) => item.titleRu },
]

const toForm = (item: FaqFull): CreateFaq => ({
  titleRu: item.titleRu,
  titleEn: item.titleEn,
  descriptionRu: item.descriptionRu,
  descriptionEn: item.descriptionEn,
})

function FaqAdminList() {
  const [query, setQuery] = useState('')
  const { data, isLoading, isError } = useAdminFaq(query)
  const create = useCreateFaq()
  const update = useUpdateFaq()
  const del = useDeleteFaq()

  const methods = useForm<CreateFaq>({
    resolver: zodResolver(faqFormSchema) as Resolver<CreateFaq>,
    defaultValues: EMPTY_FAQ,
  })

  const [editItem, setEditItem] = useState<FaqFull | null>(null)
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
    methods.reset(EMPTY_FAQ)
    setIsOpen(true)
  }

  const openEdit = (item: FaqFull) => {
    resetMutations()
    setEditItem(item)
    methods.reset(toForm(item))
    setIsOpen(true)
  }

  const save = (values: CreateFaq) => {
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
    <div className='faq-entity'>
      <AdminTable
        columns={COLUMNS}
        data={data}
        getRowKey={(item) => item.id}
        onRowClick={openEdit}
        onCreate={openCreate}
        createLabel='Создать вопрос'
        searchPlaceholder='Вопрос, ответ...'
        onSearch={setQuery}
      />

      <AdminModal
        title={editItem ? 'Редактировать FAQ' : 'Новый вопрос FAQ'}
        isOpen={isOpen}
        onClose={close}
        onSave={methods.handleSubmit(save)}
        onRemove={editItem ? removeCurrent : undefined}
        error={(create.error ?? update.error ?? del.error)?.message}
      >
        <FormProvider {...methods}>
          <FaqForm meta={editItem} />
        </FormProvider>
      </AdminModal>
    </div>
  )
}

function FaqForm({ meta }: { meta: FaqFull | null }) {
  const { register, formState: { errors } } = useFormContext<CreateFaq>()

  const texts: [keyof CreateFaq, string, boolean?][] = [
    ['titleRu', 'Вопрос (RU)'],
    ['titleEn', 'Вопрос (EN)'],
    ['descriptionRu', 'Ответ, markdown (RU)', true],
    ['descriptionEn', 'Ответ, markdown (EN)', true],
  ]

  const readOnly: [keyof FaqFull, string][] = [
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
    </div>
  )
}

export default FaqAdminList
