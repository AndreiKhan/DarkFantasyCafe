import type { ReactNode } from 'react'
import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

Font.register({
  family: 'NotoSans',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5.0.8/files/noto-sans-cyrillic-400-normal.woff',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5.0.8/files/noto-sans-cyrillic-700-normal.woff',
      fontWeight: 700,
    },
  ],
})

export type CharacterPdfData = {
  name: string
  summary: string
  background: string
  alignment: string
  appearance?: string
  bio?: string
  appearanceLabel?: string
  bioLabel?: string
  abilities: { label: string; value: number }[]
  combat?: string
  sections: { title: string; items: string[] }[]
}

const s = StyleSheet.create({
  page: { fontFamily: 'NotoSans', fontSize: 10, padding: 32, },
  frame: { borderWidth: 2, borderColor: '#000', padding: 16, flex: 1 },
  name: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  summary: { fontSize: 11, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  ability: { flex: 1, borderWidth: 1, borderColor: '#000', padding: 6, alignItems: 'center' },
  abilityLabel: { fontSize: 7, textTransform: 'uppercase', color: '#000' },
  abilityValue: { fontSize: 14, fontWeight: 700, marginTop: 2 },
  meta: { fontSize: 9, marginBottom: 4 },
  section: { marginTop: 8 },
  sectionTitle: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4, color: '#000' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  tag: { fontSize: 8, borderWidth: 1, borderColor: '#000', paddingHorizontal: 5, paddingVertical: 2 },
  text: { fontSize: 9, lineHeight: 1.4 },
})

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  )
}

export function CharacterSheetDocument({ data }: { data: CharacterPdfData }) {
  return (
    <Document title={data.name}>
      <Page size='A4' style={s.page}>
        <View style={s.frame}>
          <Text style={s.name}>{data.name}</Text>
          <Text style={s.summary}>{data.summary}</Text>

          <View style={s.row}>
            {data.abilities.map((a) => (
              <View key={a.label} style={s.ability}>
                <Text style={s.abilityLabel}>{a.label}</Text>
                <Text style={s.abilityValue}>{a.value}</Text>
              </View>
            ))}
          </View>

          <Text style={s.meta}>{data.background}</Text>
          <Text style={s.meta}>{data.alignment}</Text>
          {data.combat && <Text style={s.meta}>{data.combat}</Text>}

          {data.sections.map((section) => (
            <Section key={section.title} title={section.title}>
              <View style={s.tagRow}>
                {section.items.map((item, i) => (
                  <Text key={`${item}-${i}`} style={s.tag}>{item}</Text>
                ))}
              </View>
            </Section>
          ))}

          {data.appearance && (
            <Section title={data.appearanceLabel ?? 'Appearance'}>
              <Text style={s.text}>{data.appearance}</Text>
            </Section>
          )}

          {data.bio && (
            <Section title={data.bioLabel ?? 'Bio'}>
              <Text style={s.text}>{data.bio}</Text>
            </Section>
          )}
        </View>
      </Page>
    </Document>
  )
}
