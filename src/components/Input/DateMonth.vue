<template>
  <div class="relative">
    <button :class="disabled ? 'button-disabled' : 'button-modal'" :disabled="disabled" type="button" @click="openModal()">
      <p class="pr-3">{{ `${value?.date } ${store.month[(value?.month) - 1].label}` }}</p> 
      <i class="ri-calendar-2-line"></i>
    </button>

    <!-- modal -->
    <div class="flex-0 absolute w-[250px] h-[200px] overflow-hidden z-10" :class="on_top ? 'bottom-full' : 'top-full'" v-if="show" @click.self="closeModal()">
      <div class="fixed w-screen h-screen left-0 top-0" @click="closeModal()"></div>

      <div ref="dropdown_menu_cuti" class="relative grid grid-cols-2 divide-x w-full h-full rounded-xl py-3 bg-base-white border overflow-hidden">
        <div class="grid h-full overflow-hidden text-center text-xs px-3">
          <p class="border-b pb-1 mb-2 font-semibold">Tanggal</p>
          <div class="grid overflow-auto w-full px-1">
            <button type="button" v-for="date in store.date" :class="date.value == value?.date ? 'date-button-active' : 'date-button'" @click="value.date = date.value">{{ date.label }}</button>
          </div>
        </div>
        <div class="grid h-full overflow-hidden text-center text-xs px-3">
          <p class="border-b pb-1 mb-2 font-semibold">Bulan</p>
          <div class="grid overflow-auto w-full px-1">
            <button type="button" v-for="month in store.month" :class="month.value == value?.month ? 'date-button-active' : 'date-button'" @click="value.month = month.value"> {{ month.label }} </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSisaCutiStore } from '@/stores/company/presensi/cuti/sisa_cuti.store.js'

export default {
  props: {
    value: {
      type: Object,
      required: true,
      validator: (v) => v && typeof v === 'object' && 'date' in v && 'month' in v
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      store: useSisaCutiStore(),
      on_top: false,
    }
  },
  methods: {
    openModal() {
      this.show = !this.show
      this.$nextTick(() => {
        this.on_top = (this.$refs.dropdown_menu_cuti.getBoundingClientRect().bottom > document.getElementById('dropdown_container_cuti').getBoundingClientRect().bottom);     
      })
    },
    closeModal() {
      this.show = false
      this.on_top = false
    }
  } 
}
</script>

<style scoped>
.button-modal {
  @apply flex justify-between p-[10px] w-[150px] border rounded-lg text-xs mr-2 px-4 bg-base-white
}
.button-disabled {
  @apply flex justify-between p-[10px] w-[150px] border rounded-lg text-xs mr-2 px-4 bg-gray-50 opacity-80
}
.date-button {
  @apply px-2 py-1 hover:bg-primary-50 rounded-lg
}
.date-button-active {
  @apply px-2 py-1 bg-primary-500 text-base-white rounded-lg
}

</style>