import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
const ruModules = import.meta.glob('../locales/ru/*.json', { eager: true })
const enModules = import.meta.glob('../locales/en/*.json', { eager: true })

function loadNamespaces(modules: Record<string, { default: object }>) {
  const result: Record<string, object> = {}
  for (const path in modules) {
    const namespace = path.match(/\/([^/]+)\.json$/)?.[1]
    if (namespace) {
      result[namespace] = modules[path].default
    }
  }
  return result
}

i18n.use(initReactI18next).init({
  resources: {
    ru: loadNamespaces(ruModules),
    en: loadNamespaces(enModules),
  },
  lng: localStorage.getItem('lang') || 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  }
})

export default i18n