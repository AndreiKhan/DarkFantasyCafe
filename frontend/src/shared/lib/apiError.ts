import type { TFunction } from 'i18next'

export function getApiErrorMessage(error: unknown, t: TFunction): string {
  const code = (error as { code?: string } | null | undefined)?.code

  if (code) {
    return t(`errors:api.${code}`, { defaultValue: t('errors:api.UNKNOWN') })
  }
  return t('errors:api.UNKNOWN')
}
