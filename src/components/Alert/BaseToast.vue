<template>
  <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0 translate-y-3"
    enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-200"
    leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-3">
    <div v-if="show" class="relative overflow-hidden rounded-[28px]  shadow-xl p-6 flex items-start gap-5 w-[312px]"
      :style="{ backgroundColor }">
      <!-- Background Decoration -->
      <div class="absolute left-0 top-0 w-[80px] h-[80px] rounded-br-[90px]"
        :style="{ backgroundColor: accentColor }" />

      <div class="absolute left-16 bottom-8 w-[18px] h-[18px] rounded-full opacity-90"
        :style="{ backgroundColor: accentColor }" />

      <!-- Icon -->
      <div class="relative z-10 w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
        <IconToasSuccess v-if="type === 'success'" class="w-6 h-6" :style="{ color: accentColor }" />

        <IconDashboardWarning v-else class="w-6 h-6" :style="{ color: accentColor }" />
      </div>

      <!-- Content -->
      <div class="relative z-10 flex-1 pr-10">
        <h3 class="font-bold text-[14px] text-[#1D1B3F]">
          {{ title }}
        </h3>

        <p class="mt-2 text-[14px] leading-8 text-[#727272]">
          {{ message }}
        </p>
      </div>

      <!-- Close -->
      <button class="absolute right-6 top-6 text-black hover:opacity-70" @click="$emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IconToasSuccess from '@/components/Icon/ToastSuccess.vue'
import IconDashboardWarning from '@/components/Icon/Dashboard/Warning.vue'


interface Props {
  show: boolean
  type?: 'success' | 'error'
  title: string
  message: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success'
})

defineEmits<{
  (e: 'close'): void
}>()

const accentColor = computed(() =>
  props.type === 'success'
    ? '#6AD7B3'
    : '#FB6056'
)

const backgroundColor = computed(() =>
  props.type === 'success'
    ? '#F4FBF9'
    : '#FFF4F3'
)
</script>