import './CharacterForm.scss'
import { useEffect, useMemo } from 'react'
import { useForm, Controller, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import {
  useReferenceData,
  createCharacterFormSchema,
  getMaxSpellLevel,
  MAX_INVENTORY_ITEMS,
  MAX_EQUIPMENT_ITEMS,
  type CreateCharacterInput,
} from '@/entities/Character'
import { Dropdown, MultiSelect, TagListInput, ImageDropzone, Loader } from '@/shared/ui'
import { getApiErrorMessage } from '@/shared/lib/apiError'

const EMPTY_VALUES: CreateCharacterInput = {
  name: '',
  level: 1,
  bio: '',
  class: '',
  subclass: '',
  race: '',
  subrace: '',
  background: '',
  alignment: '',
  avatar: '',
  appearance: '',
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
  hitPoints: undefined,
  armorClass: undefined,
  speed: undefined,
  spells: [],
  languages: [],
  skills: [],
  equipment: [],
  inventory: [],
}

const ABILITY_KEYS = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const

function CharacterForm({ defaultValues, onSubmit, isPending, isSuccess, error, submitLabel }: {
  defaultValues?: Partial<CreateCharacterInput>
  onSubmit: (values: CreateCharacterInput) => void
  isPending: boolean
  isSuccess?: boolean
  error?: unknown
  submitLabel: string
}) {
  const { t } = useTranslation(['character', 'common', 'errors'])
  const { data: dnd, isLoading: isDndLoading } = useReferenceData()

  const resolver = useMemo(() => zodResolver(createCharacterFormSchema(t)) as Resolver<CreateCharacterInput>, [t])

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<CreateCharacterInput>({
    resolver,
    defaultValues: { ...EMPTY_VALUES, ...defaultValues },
  })

  const race = watch('race')
  const dndClass = watch('class')
  const level = watch('level')

  const subraceOptions = dnd?.subracesByRace[race] ?? []
  const subclassOptions = dnd?.subclassesByClass[dndClass] ?? []
  const maxSpellLevel = getMaxSpellLevel(Number(level) || 1)

  useEffect(() => {
    if (!subraceOptions.some((option) => option.index === watch('subrace'))) {
      setValue('subrace', '')
    }
  }, [race])

  useEffect(() => {
    if (!subclassOptions.some((option) => option.index === watch('subclass'))) {
      setValue('subclass', '')
    }
  }, [dndClass])

  if (isDndLoading || !dnd) {
    return <Loader width='120px' height='120px' />
  }

  const toOptions = (entries: { index: string; name: string }[]) =>
    entries.map((entry) => ({ value: entry.index, label: entry.name }))

  const spellOptions = dnd.spells
    .filter((spell) => spell.level <= maxSpellLevel)
    .map((spell) => ({ value: spell.index, label: spell.level === 0 ? spell.name : `${spell.name} (${spell.level})` }))

  return (
    <form className='character-form' onSubmit={handleSubmit(onSubmit)}>
      <section className='character-form__section'>
        <h2 className='character-form__section-title'>{t('character:sections.identity')}</h2>

        <label className='character-form__field'>
          {t('character:fields.name')}
          <div className='input-parchment-wrapper'>
            <input className='character-form__input' {...register('name')} />
          </div>
          {errors.name && <span className='character-form__error'>{errors.name.message}</span>}
        </label>

        <Controller
          name='avatar'
          control={control}
          render={({ field }) => (
            <ImageDropzone
              label={t('character:fields.avatar')}
              value={field.value ? [field.value] : []}
              onChange={(urls) => field.onChange(urls[0] ?? '')}
            />
          )}
        />

        <div className='character-form__row'>
          <Controller
            name='race'
            control={control}
            render={({ field }) => (
              <Dropdown
                label={t('character:fields.race')}
                value={field.value || null}
                options={toOptions(dnd.races)}
                onChange={field.onChange}
                error={errors.race?.message}
              />
            )}
          />

          {subraceOptions.length > 0 &&
            <Controller
              name='subrace'
              control={control}
              render={({ field }) => (
                <Dropdown
                  label={t('character:fields.subrace')}
                  value={field.value || null}
                  options={toOptions(subraceOptions)}
                  onChange={field.onChange}
                />
              )}
            />
          }
        </div>

        <div className='character-form__row'>
          <Controller
            name='class'
            control={control}
            render={({ field }) => (
              <Dropdown
                label={t('character:fields.class')}
                value={field.value || null}
                options={toOptions(dnd.classes)}
                onChange={field.onChange}
                error={errors.class?.message}
              />
            )}
          />

          {subclassOptions.length > 0 &&
            <Controller
              name='subclass'
              control={control}
              render={({ field }) => (
                <Dropdown
                  label={t('character:fields.subclass')}
                  value={field.value || null}
                  options={toOptions(subclassOptions)}
                  onChange={field.onChange}
                />
              )}
            />
          }
        </div>

        <label className='character-form__field character-form__field--narrow'>
          {t('character:fields.level')}
          <div className='input-parchment-wrapper'>
            <input className='character-form__input' type='number' {...register('level')} />
          </div>
          {errors.level && <span className='character-form__error'>{errors.level.message}</span>}
        </label>

        <div className='character-form__row'>
          <Controller
            name='background'
            control={control}
            render={({ field }) => (
              <Dropdown
                label={t('character:fields.background')}
                value={field.value || null}
                options={toOptions(dnd.backgrounds)}
                onChange={field.onChange}
                error={errors.background?.message}
              />
            )}
          />

          <Controller
            name='alignment'
            control={control}
            render={({ field }) => (
              <Dropdown
                label={t('character:fields.alignment')}
                value={field.value || null}
                options={toOptions(dnd.alignments)}
                onChange={field.onChange}
                error={errors.alignment?.message}
              />
            )}
          />
        </div>

        <label className='character-form__field'>
          {t('character:fields.appearance')}
          <div className='input-parchment-wrapper'>
            <textarea className='character-form__textarea' {...register('appearance')} />
          </div>
        </label>

        <label className='character-form__field'>
          {t('character:fields.bio')}
          <div className='input-parchment-wrapper'>
            <textarea className='character-form__textarea' {...register('bio')} />
          </div>
        </label>
      </section>

      <section className='character-form__section'>
        <h2 className='character-form__section-title'>{t('character:sections.abilities')}</h2>

        <div className='character-form__abilities'>
          {ABILITY_KEYS.map((key) => (
            <label key={key} className='character-form__field character-form__field--narrow'>
              {t(`character:fields.${key}`)}
              <div className='input-parchment-wrapper'>
                <input className='character-form__input' type='number' {...register(key)} />
              </div>
              {errors[key] && <span className='character-form__error'>{errors[key]?.message}</span>}
            </label>
          ))}
        </div>
      </section>

      <section className='character-form__section'>
        <h2 className='character-form__section-title'>{t('character:sections.combat')}</h2>

        <div className='character-form__row'>
          <label className='character-form__field character-form__field--narrow'>
            {t('character:fields.hitPoints')}
            <div className='input-parchment-wrapper'>
              <input type='number' {...register('hitPoints')} />
            </div>
          </label>

          <label className='character-form__field character-form__field--narrow'>
            {t('character:fields.armorClass')}
            <div className='input-parchment-wrapper'>
              <input type='number' {...register('armorClass')} />
            </div>
          </label>

          <label className='character-form__field character-form__field--narrow'>
            {t('character:fields.speed')}
            <div className='input-parchment-wrapper'>
              <input type='number' {...register('speed')} />
            </div>
          </label>
        </div>
      </section>

      <section className='character-form__section'>
        <h2 className='character-form__section-title'>{t('character:sections.spellsAndSkills')}</h2>

        <Controller
          name='spells'
          control={control}
          render={({ field }) => (
            <MultiSelect
              label={`${t('character:fields.spells')} — ${t('character:hints.spellsByLevel', { maxLevel: maxSpellLevel })}`}
              value={field.value ?? []}
              options={spellOptions}
              onChange={field.onChange}
              placeholder={t('character:placeholders.addSpell')}
            />
          )}
        />

        <Controller
          name='languages'
          control={control}
          render={({ field }) => (
            <MultiSelect
              label={t('character:fields.languages')}
              value={field.value ?? []}
              options={toOptions(dnd.languages)}
              onChange={field.onChange}
              placeholder={t('character:placeholders.addLanguage')}
            />
          )}
        />

        <Controller
          name='skills'
          control={control}
          render={({ field }) => (
            <MultiSelect
              label={t('character:fields.skills')}
              value={field.value ?? []}
              options={toOptions(dnd.skills)}
              onChange={field.onChange}
              placeholder={t('character:placeholders.addSkill')}
            />
          )}
        />
      </section>

      <section className='character-form__section'>
        <h2 className='character-form__section-title'>{t('character:sections.equipment')}</h2>

        <Controller
          name='equipment'
          control={control}
          render={({ field }) => (
            <TagListInput
              label={t('character:fields.equipment')}
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder={t('character:placeholders.addEquipment')}
              maxItems={MAX_EQUIPMENT_ITEMS}
            />
          )}
        />

        <Controller
          name='inventory'
          control={control}
          render={({ field }) => (
            <TagListInput
              label={t('character:fields.inventory')}
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder={t('character:placeholders.addInventoryItem')}
              maxItems={MAX_INVENTORY_ITEMS}
            />
          )}
        />
      </section>

      <button className='character-form__submit' type='submit' disabled={isPending}>
        {submitLabel}
      </button>

      {error !== undefined && error !== null &&
        <p className='character-form__status character-form__status--error' role='alert'>
          {getApiErrorMessage(error, t)}
        </p>
      }

      {!error && isSuccess &&
        <p className='character-form__status character-form__status--success' role='status'>
          {t('common:actions.saved')}
        </p>
      }
    </form>
  )
}

export default CharacterForm
