import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useAdminCharacters,
  useCreateCharacterAdmin,
  useUpdateCharacterAdmin,
  useDeleteCharacterAdmin,
  useReferenceData,
  lookupName,
  type CharacterAdmin,
  type CreateCharacterInput,
} from '@/entities/Character'
import { useAdminUsers } from '@/entities/User'
import { AdminModal, AdminTable, Dropdown, Loader, ErrorPlug, type AdminTableColumn } from '@/shared/ui'
import CharacterAdminForm from '@/widgets/CharacterForm/CharacterAdminForm'
import { getApiErrorMessage } from '@/shared/lib/apiError'

const ADMIN_FORM_ID = 'character-admin-form'

function toFormValues(character: CharacterAdmin): Partial<CreateCharacterInput> {
  return {
    ...character,
    bio: character.bio ?? '',
    subclass: character.subclass ?? '',
    subrace: character.subrace ?? '',
    avatar: character.avatar ?? '',
    appearance: character.appearance ?? '',
    hitPoints: character.hitPoints ?? undefined,
    armorClass: character.armorClass ?? undefined,
    speed: character.speed ?? undefined,
  }
}

function CharacterAdminList() {
  const { t } = useTranslation(['character', 'common', 'errors'])
  const [query, setQuery] = useState('')
  const { data, isLoading, isError } = useAdminCharacters(query)
  const { data: users } = useAdminUsers()
  const { data: dnd } = useReferenceData()

  const create = useCreateCharacterAdmin()
  const update = useUpdateCharacterAdmin()
  const del = useDeleteCharacterAdmin()

  const [isOpen, setIsOpen] = useState(false)
  const [editItem, setEditItem] = useState<CharacterAdmin | null>(null)
  const [ownerId, setOwnerId] = useState<string | null>(null)

  const close = () => setIsOpen(false)

  const resetMutations = () => {
    create.reset()
    update.reset()
    del.reset()
  }

  const openCreate = () => {
    resetMutations()
    setEditItem(null)
    setOwnerId(users?.[0]?.id ?? null)
    setIsOpen(true)
  }

  const openEdit = (item: CharacterAdmin) => {
    resetMutations()
    setEditItem(item)
    setOwnerId(item.userId)
    setIsOpen(true)
  }

  const removeCurrent = () => {
    if (editItem) {
      del.mutate(editItem.id, { onSuccess: close })
    }
  }

  const save = (values: CreateCharacterInput) => {
    if (!ownerId) {
      return
    }

    if (editItem) {
      update.mutate({ id: editItem.id, ...values, userId: ownerId }, { onSuccess: close })
    } else {
      create.mutate({ ...values, userId: ownerId }, { onSuccess: close })
    }
  }

  const columns: AdminTableColumn<CharacterAdmin>[] = [
    { key: 'name', header: t('character:fields.name'), render: (item) => item.name },
    { key: 'owner', header: t('character:fields.owner'), render: (item) => item.user.email },
    { key: 'level', header: t('character:fields.level'), render: (item) => item.level },
    { key: 'race', header: t('character:fields.race'), render: (item) => lookupName(dnd?.races ?? [], item.race) },
    { key: 'class', header: t('character:fields.class'), render: (item) => lookupName(dnd?.classes ?? [], item.class) },
  ]

  const mutationError = create.error ?? update.error ?? del.error

  if (isLoading) {
    return <Loader width='100px' height='100px' />
  }
  if (isError || !data) {
    return <ErrorPlug />
  }

  return (
    <div className='character-entity'>
      <AdminTable
        columns={columns}
        data={data}
        getRowKey={(item) => item.id}
        onRowClick={openEdit}
        onCreate={openCreate}
        createLabel={t('character:list.create')}
        searchPlaceholder={t('character:fields.name')}
        onSearch={setQuery}
      />

      <AdminModal
        title={editItem ? t('character:actions.editCharacter') : t('character:list.create')}
        isOpen={isOpen}
        onClose={close}
        onSave={() => document.getElementById(ADMIN_FORM_ID)?.requestSubmit()}
        onRemove={editItem ? removeCurrent : undefined}
        error={mutationError ? getApiErrorMessage(mutationError, t) : undefined}
      >
        <div className='admin-form'>
          <label className='admin-form__field'>
            {t('character:fields.owner')}
            <Dropdown
              value={ownerId}
              options={(users ?? []).map((user) => ({ value: user.id, label: `${user.email} (${user.firstName} ${user.secondName})` }))}
              onChange={setOwnerId}
            />
          </label>

          <CharacterAdminForm
            key={editItem?.id ?? 'new'}
            formId={ADMIN_FORM_ID}
            defaultValues={editItem ? toFormValues(editItem) : undefined}
            onSubmit={save}
          />
        </div>
      </AdminModal>
    </div>
  )
}

export default CharacterAdminList
