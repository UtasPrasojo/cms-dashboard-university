<template>
  <div
    class="bg-white rounded-3xl flex flex-col justify-between h-full w-full p-4"
  >
    <div class="flex items-center gap-4">
      <div
        class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
      >
        <component
          :is="icon"
          class="w-6 h-6 text-primary-700"
        />
      </div>

      <h3 class="text-[14px] text-primary-900">
        {{ title }}
      </h3>
    </div>

    <div class="mt-8">
      <p class="text-[24px] leading-none font-normal text-primary-900">
        {{ value }}
      </p>

      <p class="mt-2 text-[12px] font-medium text-gray-500">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: any
  title: string
  value: string | number
  description: string
}>()
</script>