import './CharactersPage.scss'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCharacters, useReferenceData, lookupName } from '@/entities/Character'
import { useMe } from '@/entities/Auth'
import { ErrorPlug, Loader } from '@/shared/ui'
import SectionDecoratedTitle from '@/shared/ui/SectionDecoratedTitle/SectionDecoratedTitle'
import { ROUTES } from '@/shared/config/routes'

function CharactersPage() {
  const { t } = useTranslation(['character', 'common'])
  const { data: me } = useMe()
  const { data: characters, isLoading, isError } = useCharacters()
  const { data: dnd } = useReferenceData()

  if (isLoading) {
    return <Loader width='200px' height='200px' />
  }
  if (isError) {
    return <ErrorPlug />
  }

  return (
    <section className='center characters'>
      <SectionDecoratedTitle title={t('character:list.title')} />

      {me?.user &&
        <Link className='characters__create' to={ROUTES.characterNew}>
          {t('character:list.create')}
        </Link>
      }

      {characters && characters.length === 0 &&
        <p className='characters__empty'>{t('character:list.empty')}</p>
      }

      <ul className='characters__list'>
        {characters?.map((character) => (
          <li className='characters__item' key={character.id}>
            <Link className='characters__link' to={ROUTES.character(character.id)}>
              <div
                className='characters__avatar'
                style={character.avatar ? { backgroundImage: `url(${character.avatar})` } : undefined}
              />
              <div className='characters__info'>
                <h3 className='characters__name'>{character.name}</h3>
                <p className='characters__meta'>
                  {t('character:fields.level')} {character.level} · {lookupName(dnd?.races ?? [], character.race)} {lookupName(dnd?.classes ?? [], character.class)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CharactersPage
