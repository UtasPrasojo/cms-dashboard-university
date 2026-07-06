<template>
  <div class="rounded-3xl bg-base-white border border-[#ECECEC] p-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center">
          <component :is="icon" class="w-6 h-6 text-primary-500" />
        </div>

        <h2 class="text-[14px] font-medium text-primary-900">
          {{ title }}
        </h2>
      </div>

      <button class="w-6 h-6 rounded-full border-2 border-[#252547] flex items-center justify-center">
        <span class="text-sm font-semibold">i</span>
      </button>
    </div>

    <!-- Data -->
    <div class="space-y-6">
      <div v-for="(row, index) in items" :key="index" :class="row.fullWidth ? '' : 'grid grid-cols-2 gap-5'">
        <!-- Full Width -->
        <template v-if="row.fullWidth">
          <div>
            <p class="text-[14px] font-medium text-primary-900 mb-3">
              {{ row.label }}
            </p>

            <InputText :model-value="row.value != null ? String(row.value) : null"
              @update:model-value="(value) => (row.value = value ?? undefined)" :name="`academic-${index}`"
              inputClass=" !border-[#D8D8D8] !" />

            <p v-if="row.suffix" class="mt-2 text-[12px] font-medium text-primary-900">
              {{ row.suffix }}
            </p>
          </div>
        </template>

        <!-- Two Columns -->
        <template v-else>
          <div v-for="(field, idx) in row.fields" :key="idx">
            <p class="text-[14px] font-medium text-primary-900 mb-3">
              {{ field.label }}
            </p>

            <InputText :model-value="String(field.value)" @update:model-value="(value) => (field.value = value ?? '')"
              :name="`academic-field-${index}-${idx}`" inputClass="  !border-[#D8D8D8] " />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Field {
  label: string
  value: string | number
}

interface DataRow {
  fullWidth?: boolean
  label?: string
  value?: string | number
  suffix?: string
  fields?: Field[]
}

defineProps<{
  title: string
  icon: Component
  items: DataRow[]
}>()
</script>