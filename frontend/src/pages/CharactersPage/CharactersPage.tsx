import './CharactersPage.scss'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCharacters, useReferenceData, lookupName } from '@/entities/Character'
import { useMe } from '@/entities/Auth'
import { ErrorPlug, Loader, Pagination } from '@/shared/ui'
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

      <Pagination items={characters ?? []} pageSize={6}>
        {(pageItems) => (
          <ul className='characters__list'>
            {pageItems.map((character) => (
              <li className='characters__item' key={character.id}>
                <Link className='characters__link' to={ROUTES.character(character.id)}>
                  {character.avatar ? (
                    <img
                      className='characters__avatar'
                      src={character.avatar}
                      alt={`${t('character:fields.avatar')} ${character.name}`}
                    />
                  ) : (
                    <div className='characters__avatar characters__avatar--placeholder'>
                      {character.name[0]?.toUpperCase()}
                    </div>
                  )}
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
        )}
      </Pagination>
    </section>
  )
}

export default CharactersPage
