<template>
  <div class="flex flex-col items-center justify-center py-8 text-center">
    <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
      <component :is="IconComponent" :class="['h-9 w-9', imgClass]" />
    </div>

    <p :class="['mt-4 text-lg font-bold text-gray-900', titleClass]">
      {{ title }}
    </p>
    <p class="container-desc mt-1 text-sm text-gray-400">
      {{ desc }}
    </p>

    <slot />
  </div>
</template>

<script setup lang="ts">
import IconEmptyState from '@/components/Icon/EmptyState.vue'

interface Props {
  title?: string | number
  desc?: string | number
  imgClass?: string
  titleClass?: string
  variant?: 'table' | 'card'
}

withDefaults(defineProps<Props>(), {
  title: '',
  desc: '',
  imgClass: '',
  titleClass: '',
  variant: 'table',
})

const IconComponent = IconEmptyState
</script>
