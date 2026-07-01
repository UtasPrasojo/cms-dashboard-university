<template>
  <div
    class="rounded-3xl   p-5 h-full flex flex-col justify-between transition-all"
    :class="variantClass.bg"
  >
    <div class="flex justify-between items-start">
      <div>
        <p
          class="text-xl font-medium"
          :class="variantClass.text"
        >
          {{ title }}
        </p>

        <h2
          class="text-5xl font-semibold mt-2"
          :class="variantClass.text"
        >
          {{ value }}
        </h2>
      </div>

      <div
        class="w-11 h-11 rounded-full flex items-center justify-center shadow-md"
        :class="variantClass.iconBg"
      >
        <component
          :is="icon"
          class="w-6 h-6 text-white"
        />
      </div>
    </div>

    <p
      class="text-lg"
      :class="variantClass.text"
    >
      {{ iq }} • {{ ipk }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: [String, Number],
  iq: String,
  ipk: String,
  icon: Object,
  variant: {
    type: String,
    default: 'default',
  },
})

const variants = {
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    iconBg: 'bg-orange-400',
  },
  blue: {
    bg: 'bg-indigo-100',
    text: 'text-blue-700',
    iconBg: 'bg-blue-600',
  },
  green: {
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    iconBg: 'bg-teal-500',
  },
  purple: {
    bg: 'bg-violet-100',
    text: 'text-violet-500',
    iconBg: 'bg-violet-500',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-500',
    iconBg: 'bg-red-500',
  },
  default: {
    bg: 'bg-[#F4F4F4]',
    text: 'text-slate-800',
    iconBg: 'bg-gray-400',
  },
}

const variantClass = computed(() => {
  return variants[props.variant as keyof typeof variants]
})
</script>