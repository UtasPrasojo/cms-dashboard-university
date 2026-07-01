import { defineStore } from "pinia"

export const useHelperStore = defineStore('helper', {
  state: () => ({
    /**
     * Contoh state yang akan digunakan di dalam store.
     */
    onFetch: false as Boolean,
    example: null as string | null,
    status_mini: false as Boolean,
    form_error: [] as Array<any>,
  }),
  actions: {
    activate():void {
      this.onFetch = true
    },
    deactivate():void {
      this.onFetch = false
    },
    setExample(example: string | null) {
      this.example = example
    },
  },
  
})
