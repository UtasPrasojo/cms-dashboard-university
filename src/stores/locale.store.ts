import { defineStore } from 'pinia'
import { storageHelper } from '@/helpers/storage'

export type Language = 'id' | 'en'

interface LocaleState {
  language: Language
}

export const useLocaleStore = defineStore('locale', {
  state: (): LocaleState => ({
    language: (storageHelper.getItem('language') as Language) || 'id',
  }),
  actions: {
    setLanguage(language: Language) {
      this.language = language
      storageHelper.setItem('language', language)
    },
    toggleLanguage() {
      this.setLanguage(this.language === 'id' ? 'en' : 'id')
    },
  },
})
