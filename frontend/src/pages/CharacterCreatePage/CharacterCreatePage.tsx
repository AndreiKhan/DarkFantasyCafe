import './CharacterCreatePage.scss'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCreateCharacter } from '@/entities/Character'
import CharacterForm from '@/widgets/CharacterForm/CharacterForm'
import SectionDecoratedTitle from '@/shared/ui/SectionDecoratedTitle/SectionDecoratedTitle'
import { ROUTES } from '@/shared/config/routes'

function CharacterCreatePage() {
  const { t } = useTranslation(['character', 'common'])
  const navigate = useNavigate()
  const create = useCreateCharacter()

  return (
    <section className='center character-create'>
      <SectionDecoratedTitle title={t('character:list.create')} />
      <CharacterForm
        submitLabel={t('character:actions.createCharacter')}
        isPending={create.isPending}
        error={create.error}
        onSubmit={(values) => {
          create.mutate(values, {
            onSuccess: (character) => navigate(ROUTES.character(character.id), { state: { justCreated: true } }),
          })
        }}
      />
    </section>
  )
}

export default CharacterCreatePage
