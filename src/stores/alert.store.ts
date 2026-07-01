import { defineStore } from 'pinia'


export const AlertType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

export type AlertType = typeof AlertType[keyof typeof AlertType]

export interface AlertMessageObject {
  title?: string
  desc?: string
}

export interface AlertState {
  id: number | null
  status: boolean
  type: AlertType | null
  message: string | AlertMessageObject | null
  time: number | null
  network_status: boolean
}


let alertIdCounter = 0

export const useAlertStore = defineStore('alert', {
  state: (): AlertState => ({
    id: null,
    status: false,
    type: null,
    message: null,
    time: null,
    network_status: true,
  }),

  actions: {
    activate(type: AlertType, message: string | AlertMessageObject, time?: number) {
      alertIdCounter++
      this.id = alertIdCounter
      this.status = true
      this.type = type
      this.message = message
      this.time = time ?? 3000
    },

    deactivate() {
      this.id = null
      this.status = false
      this.type = null
      this.message = null
      this.time = null
    },
  },
})
