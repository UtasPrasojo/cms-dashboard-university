import { defineStore } from 'pinia'

export type ToastType = 'success' | 'error'

interface ToastState {
  show: boolean
  type: ToastType
  title: string
  message: string
}

let hideTimeout: ReturnType<typeof setTimeout> | null = null

export const useToastStore = defineStore('toast', {
  state: (): ToastState => ({
    show: false,
    type: 'success',
    title: '',
    message: '',
  }),

  actions: {
    display(type: ToastType, title: string, message: string, duration: number = 3000) {
      if (hideTimeout) clearTimeout(hideTimeout)

      this.show = true
      this.type = type
      this.title = title
      this.message = message

      hideTimeout = setTimeout(() => this.hide(), duration)
    },

    hide() {
      this.show = false
    },
  },
})
