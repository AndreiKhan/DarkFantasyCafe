import './CharacterAdminForm.scss'
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

function CharacterAdminForm({ formId, defaultValues, onSubmit }: {
  formId: string
  defaultValues?: Partial<CreateCharacterInput>
  onSubmit: (values: CreateCharacterInput) => void
}) {
  const { t } = useTranslation(['character', 'errors'])
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
    return <Loader width='100px' height='100px' />
  }

  const toOptions = (entries: { index: string; name: string }[]) =>
    entries.map((entry) => ({ value: entry.index, label: entry.name }))

  const spellOptions = dnd.spells
    .filter((spell) => spell.level <= maxSpellLevel)
    .map((spell) => ({ value: spell.index, label: spell.level === 0 ? spell.name : `${spell.name} (${spell.level})` }))

  return (
    <form id={formId} className='character-admin-form' onSubmit={handleSubmit(onSubmit)}>
      <section className='admin-form__section'>
        <span className='admin-form__section-title'>{t('character:sections.identity')}</span>

        <label className='admin-form__field'>
          {t('character:fields.name')}
          <input {...register('name')} />
          {errors.name && <span className='admin-form__error'>{errors.name.message}</span>}
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

        <div className='character-admin-form__row'>
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

        <div className='character-admin-form__row'>
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

        <div className='character-admin-form__row character-admin-form__row--triple'>
          <label className='admin-form__field'>
            {t('character:fields.level')}
            <input type='number' {...register('level')} />
            {errors.level && <span className='admin-form__error'>{errors.level.message}</span>}
          </label>

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

        <label className='admin-form__field'>
          {t('character:fields.appearance')}
          <textarea className='character-admin-form__textarea' {...register('appearance')} />
        </label>

        <label className='admin-form__field'>
          {t('character:fields.bio')}
          <textarea className='character-admin-form__textarea' {...register('bio')} />
        </label>
      </section>

      <section className='admin-form__section'>
        <span className='admin-form__section-title'>{t('character:sections.abilities')}</span>

        <div className='character-admin-form__abilities'>
          {ABILITY_KEYS.map((key) => (
            <label key={key} className='admin-form__field'>
              {t(`character:fields.${key}`)}
              <input type='number' {...register(key)} />
              {errors[key] && <span className='admin-form__error'>{errors[key]?.message}</span>}
            </label>
          ))}
        </div>
      </section>

      <section className='admin-form__section'>
        <span className='admin-form__section-title'>{t('character:sections.combat')}</span>

        <div className='character-admin-form__row character-admin-form__row--triple'>
          <label className='admin-form__field'>
            {t('character:fields.hitPoints')}
            <input type='number' {...register('hitPoints')} />
          </label>

          <label className='admin-form__field'>
            {t('character:fields.armorClass')}
            <input type='number' {...register('armorClass')} />
          </label>

          <label className='admin-form__field'>
            {t('character:fields.speed')}
            <input type='number' {...register('speed')} />
          </label>
        </div>
      </section>

      <section className='admin-form__section'>
        <span className='admin-form__section-title'>{t('character:sections.spellsAndSkills')}</span>

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

        <div className='character-admin-form__row'>
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
        </div>
      </section>

      <section className='admin-form__section'>
        <span className='admin-form__section-title'>{t('character:sections.equipment')}</span>

        <div className='character-admin-form__row'>
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
        </div>
      </section>
    </form>
  )
}

export default CharacterAdminForm
