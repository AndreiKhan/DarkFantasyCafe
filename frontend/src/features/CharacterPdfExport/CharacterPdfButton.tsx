import { createElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { lookupName, type Character, type DndReferenceData } from '@/entities/Character'
import type { CharacterPdfData } from './CharacterSheetDocument'
import {Loader } from '@/shared/ui'

const ABILITIES = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const

function buildPdfData(
  character: Character,
  dnd: DndReferenceData | undefined,
  t: (key: string) => string,
): CharacterPdfData {
  const race = lookupName(dnd?.races ?? [], character.race)
  const subrace = character.subrace ? lookupName(dnd?.subracesByRace[character.race] ?? [], character.subrace) : ''
  const className = lookupName(dnd?.classes ?? [], character.class)
  const subclass = character.subclass ? lookupName(dnd?.subclassesByClass[character.class] ?? [], character.subclass) : ''

  const combat = [
    character.hitPoints != null ? `${t('fields.hitPoints')}: ${character.hitPoints}` : '',
    character.armorClass != null ? `${t('fields.armorClass')}: ${character.armorClass}` : '',
    character.speed != null ? `${t('fields.speed')}: ${character.speed}` : '',
  ].filter(Boolean).join(' · ')

  const sections = [
    { title: t('fields.spells'), items: character.spells.map((i) => lookupName(dnd?.spells ?? [], i)) },
    { title: t('fields.skills'), items: character.skills.map((i) => lookupName(dnd?.skills ?? [], i)) },
    { title: t('fields.languages'), items: character.languages.map((i) => lookupName(dnd?.languages ?? [], i)) },
    { title: t('fields.equipment'), items: character.equipment },
    { title: t('fields.inventory'), items: character.inventory },
  ].filter((s) => s.items.length > 0)

  return {
    name: character.name,
    summary: `${t('fields.level')} ${character.level} · ${race}${subrace ? ` (${subrace})` : ''} · ${className}${subclass ? ` (${subclass})` : ''}`,
    background: `${t('fields.background')}: ${lookupName(dnd?.backgrounds ?? [], character.background)}`,
    alignment: `${t('fields.alignment')}: ${lookupName(dnd?.alignments ?? [], character.alignment)}`,
    appearance: character.appearance ?? undefined,
    bio: character.bio ?? undefined,
    appearanceLabel: t('fields.appearance'),
    bioLabel: t('fields.bio'),
    abilities: ABILITIES.map((key) => ({ label: t(`fields.${key}`), value: character[key] })),
    combat: combat || undefined,
    sections,
  }
}

interface CharacterPdfButtonProps {
  character: Character
  dnd?: DndReferenceData
  className?: string
}

export function CharacterPdfButton({ character, dnd, className }: CharacterPdfButtonProps) {
  const { t } = useTranslation('character')
  const [pending, setPending] = useState(false)

  const handleClick = async () => {
    setPending(true)
    try {
      const data = buildPdfData(character, dnd, t)
      const [{ pdf }, { CharacterSheetDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./CharacterSheetDocument'),
      ])
      const blob = await pdf(createElement(CharacterSheetDocument, { data }) as Parameters<typeof pdf>[0]).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${character.name.replace(/[^\p{L}\p{N}\s-]/gu, '').trim() || 'character'}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setPending(false)
    }
  }

  return (
    <button type='button' className={className} disabled={pending} onClick={handleClick}>
      {pending ? <Loader  height='50px' width='50px'/> : t('actions.downloadPdf')}
    </button>
  )
}
