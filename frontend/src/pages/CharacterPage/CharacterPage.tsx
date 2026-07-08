import './CharacterPage.scss'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMe } from '@/entities/Auth'
import {
  useCharacter,
  useReferenceData,
  useUpdateCharacter,
  useDeleteCharacter,
  lookupName,
  type Character,
  type CreateCharacterInput,
} from '@/entities/Character'
import CharacterForm from '@/widgets/CharacterForm/CharacterForm'
import { CharacterPdfButton } from '@/features/CharacterPdfExport'
import { ErrorPlug, Loader } from '@/shared/ui'
import { ROUTES } from '@/shared/config/routes'

function TextList({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul className='character-page__list'>
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  )
}

function toFormValues(character: Character): Partial<CreateCharacterInput> {
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

function CharacterPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation(['character', 'common', 'errors'])
  const navigate = useNavigate()
  const location = useLocation()
  const justCreated = Boolean((location.state as { justCreated?: boolean } | null)?.justCreated)
  const { data: me } = useMe()
  const { data: character, isLoading, isError } = useCharacter(id!)
  const { data: dnd } = useReferenceData()
  const update = useUpdateCharacter()
  const del = useDeleteCharacter()

  if (isLoading) {
    return <Loader width='200px' height='200px' />
  }
  if (isError || !character) {
    return <ErrorPlug />
  }

  const isOwner = me?.user.sub === character.userId

  const spellNames = character.spells.map((index) => lookupName(dnd?.spells ?? [], index))
  const languageNames = character.languages.map((index) => lookupName(dnd?.languages ?? [], index))
  const skillNames = character.skills.map((index) => lookupName(dnd?.skills ?? [], index))

  return (
    <section className='center character-page'>
      <div className='character-page__header'>
        <div className='character-page__avatar'>
          {character.avatar ? (
            <img className='character-page__avatar-image' src={character.avatar} alt={character.name} />
          ) : (
            <div className='character-page__avatar-placeholder'>{character.name[0]?.toUpperCase()}</div>
          )}
        </div>

        <div>
          <h1 className='character-page__name'>{character.name}</h1>
          <p className='character-page__summary'>
            {t('character:fields.level')} {character.level} · {lookupName(dnd?.races ?? [], character.race)}
            {character.subrace ? ` (${lookupName(dnd?.subracesByRace[character.race] ?? [], character.subrace)})` : ''}
            {' '}{lookupName(dnd?.classes ?? [], character.class)}
            {character.subclass ? ` (${lookupName(dnd?.subclassesByClass[character.class] ?? [], character.subclass)})` : ''}
          </p>
          <CharacterPdfButton character={character} dnd={dnd} className='character-page__pdf' />
        </div>
      </div>

      {justCreated &&
        <p className='character-page__notice' role='status'>
          {t('character:notifications.created')}
        </p>
      }

      {!isOwner ? (
        <div className='character-page__sheet'>
          <p>
            <strong>{t('character:fields.background')}:</strong> {lookupName(dnd?.backgrounds ?? [], character.background)}
          </p>
          <p>
            <strong>{t('character:fields.alignment')}:</strong> {lookupName(dnd?.alignments ?? [], character.alignment)}
          </p>
          {character.appearance &&
            <p>
              <strong>{t('character:fields.appearance')}:</strong> {character.appearance}
            </p>
          }
          {character.bio &&
            <p className='character-page__bio'>
              {character.bio}
            </p>
          }

          <div className='character-page__abilities'>
            {(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const).map((key) => (
              <div key={key} className='character-page__ability'>
                <span className='character-page__ability-label'>
                  {t(`character:fields.${key}`)}
                </span>
                <span className='character-page__ability-value'>
                  {character[key]}
                </span>
              </div>
            ))}
          </div>

          <p>
            {character.hitPoints != null &&
              <>
                {t('character:fields.hitPoints')}: {character.hitPoints} ·
              </>
            }
            {character.armorClass != null &&
              <>
                &nbsp;{t('character:fields.armorClass')}: {character.armorClass} ·
              </>
            }
            {character.speed != null &&
              <>
                &nbsp;{t('character:fields.speed')}: {character.speed}
              </>
            }
          </p>

          {spellNames.length > 0 &&
            <>
              <h3>
                {t('character:fields.spells')}
              </h3>
              <TextList items={spellNames} />
            </>
          }
          {languageNames.length > 0 &&
            <>
              <h3>
                {t('character:fields.languages')}
              </h3>
              <TextList items={languageNames} />
            </>
          }
          {skillNames.length > 0 &&
            <>
              <h3>
                {t('character:fields.skills')}
              </h3>
              <TextList items={skillNames} />
            </>
          }
          {character.equipment.length > 0 &&
            <>
              <h3>
                {t('character:fields.equipment')}
              </h3>
              <TextList items={character.equipment} />
            </>
          }
          {character.inventory.length > 0 &&
            <>
              <h3>
                {t('character:fields.inventory')}
              </h3>
              <TextList items={character.inventory} />
            </>
          }
        </div>
      ) : (
        <>
          <CharacterForm
            defaultValues={toFormValues(character)}
            submitLabel={t('common:actions.save')}
            isPending={update.isPending}
            isSuccess={update.isSuccess}
            error={update.error}
            onSubmit={(values) => update.mutate({ id: character.id, ...values })}
          />

          <button
            type='button'
            className='character-page__delete'
            disabled={del.isPending}
            onClick={() => {
              if (window.confirm(t('character:actions.confirmDelete'))) {
                del.mutate(character.id, { onSuccess: () => navigate(ROUTES.characters) })
              }
            }}
          >
            {t('character:actions.deleteCharacter')}
          </button>
        </>
      )}
    </section>
  )
}

export default CharacterPage
