<template>
  <div class="rounded-[28px] bg-base-white border border-[#ECECEC] p-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-4">
        <div
          class="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center"
        >
          <component
            :is="icon"
            class="w-6 h-6 text-primary-500"
          />
        </div>

        <h2 class="text-[14px] font-medium text-[#252547]">
          {{ title }}
        </h2>
      </div>

      <button
        class="w-6 h-6 rounded-full border-2 border-[#252547] flex items-center justify-center"
      >
        <span class="text-sm font-semibold">i</span>
      </button>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="(item, index) in items"
        :key="index"
      >
        <p class="text-[14px] font-medium text-[#252547] mb-3">
          {{ item.label }}
        </p>

        <InputText
          :model-value="String(item.value)"
          @update:model-value="(value) => (item.value = value ?? '')"
          :name="`employability-${index}`"
          inputClass="!border-[#D8D8D8]"
        />

        <p
          v-if="item.suffix"
          class="mt-2 text-[12px] font-medium text-[#252547]"
        >
          {{ item.suffix }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface EmployabilityItem {
  label: string
  value: string | number
  suffix?: string
}

defineProps<{
  title: string
  icon: Component
  items: EmployabilityItem[]
}>()
</script>