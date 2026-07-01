
import './app.css'
import 'remixicon/fonts/remixicon.css'
import 'vue3-toastify/dist/index.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import '@vuepic/vue-datepicker/dist/main.css'
import 'leaflet/dist/leaflet.css'
import '@flaticon/flaticon-uicons/css/all/all.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'


import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import { VueRestrictedInputDirective } from 'vue-restricted-input'
import VueApexCharts from 'vue3-apexcharts'
import DraggableResizableVue from 'draggable-resizable-vue3'
import VueCookies from 'vue3-cookies'
import VueSweetalert2 from 'vue-sweetalert2'
import PinInput from 'v-pin-input'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import PrimeVue from 'primevue/config'
import ColorPicker from 'primevue/colorpicker'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { QuillEditor } from '@vueup/vue-quill'
import moment from 'moment'


moment.locale('id', {
  months:
    'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split(
      '_',
    ),
  weekdays: "Minggu_Senin_Selasa_Rabu_Kamis_Jum'at_Sabtu".split('_'),
  weekdaysShort: 'Min_Sen_Sel_Rab_Kam_Jum_Sab'.split('_'),
  weekdaysMin: 'Mg_Sn_Sl_Rb_Km_Jm_Sb'.split('_'),
})


const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

app.use(router)
app.use(VueCookies)
app.use(VueApexCharts)
app.use(DraggableResizableVue)
app.use(PinInput)
app.use(VueQueryPlugin)
app.use(VueDOMPurifyHTML)
app.use(PrimeVue)
app.use(VueSweetalert2, {
  confirmButtonColor: '#663BCB',
  cancelButtonColor: '#ACACAC',
})


app.component('VueDatePicker', (await import('@vuepic/vue-datepicker')).VueDatePicker)
app.component('QuillEditor', QuillEditor)
app.component('ColorPicker', ColorPicker)

app.directive('mask', VueRestrictedInputDirective)

app.directive('click-outside', {
  mounted(el, binding) {
    el.__clickOutside__ = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.body.addEventListener('click', el.__clickOutside__)
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.__clickOutside__)
  },
})


app.config.globalProperties.$toIdr = (val: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(val)

app.config.globalProperties.$dateFormat = (value: string, format: string) => {
  const date = moment(value)
  date.locale('id')
  return date.format(format)
}

app.config.globalProperties.$createSlug = (data: string): string => {
  const val = data.toLowerCase()
  const category = [
    'kepribadian',
    'potensi',
    'intelektual',
    'papikostick',
    'papi kostick',
    'arah kerja',
    '360',
    'jenjang personality factors',
    'jpf',
    'ccat',
    'mbj',
    'minat bakat jenjang',
    'criteria cognitive aptitude test',
    'standard progressive matrices',
    'spm',
  ]

  const map: Record<string, string> = {
    'bakat minat': 'riasec',
    riasec: 'riasec',
    'perspective 360': '360',
    'jenjang personality factors': 'jpf',
    'personality factor': 'jpf',
    'intelegensi': 'intelektual',
    jpf: 'jpf',
    'minat bakat jenjang': 'mbj',
    ccat: 'ccat',
    kognitif: 'ccat',
    'criteria cognitive aptitude test': 'ccat',
    'standard progressive matrices': 'spm',
  }

  if (map[val]) return map[val]
  return category.includes(val) ? val : 'general'
}

app.config.globalProperties.$isPasswordValid = (
  isValid: boolean,
  password?: string,
  confirmPassword?: string,
): boolean => {
  if (isValid || !confirmPassword?.trim()) return false
  return password?.trim() === confirmPassword.trim()
}

app.config.globalProperties.$type = (): string => {
  const user = JSON.parse(localStorage.getItem('user-jenjang') || '{}')
  return user?.organization_type ?? 'empty'
}

app.config.globalProperties.$initial = (name?: string): string => {
  if (!name) return ''

  const words = name.split(' ').filter(Boolean)

  return words.length > 1
    ? words
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join('')
    : (words[0]?.slice(0, 2).toUpperCase() ?? '')
}


app.mount('#app')
