<template>
  <div class="rounded-[28px] bg-base-white border border-[#ECECEC] p-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center">
          <component :is="icon" class="w-6 h-6 text-primary-500" />
        </div>

        <h2 class="text-[14px] font-medium text-[#252547]">
          {{ title }}
        </h2>
      </div>

      <button class="w-6 h-6 rounded-full border-2 border-[#252547] flex items-center justify-center">
        <span class="text-sm font-semibold">i</span>
      </button>
    </div>

    <!-- Content -->
    <div class="space-y-4">
      <!-- Full Width -->
      <div v-for="(row, index) in items" :key="index">
        <template v-if="row.fullWidth">
          <p class="text-[14px] font-medium text-[#252547] mb-3">
            {{ row.label }}
          </p>

          <!-- Dropdown -->
          <InputSelect v-if="row.type === 'select'" :label="null" :name="`institutional-${index}`"
            :model-value="row.value != null ? String(row.value) : ''"
            @update:model-value="(value: string) => (row.value = value)"
            selectClass="!border-[#D8D8D8] !text-[14px] !text-[#3D3D3D]">
            <option v-for="option in row.options" :key="option" :value="option">
              {{ option }}
            </option>
          </InputSelect>

          <!-- Input Style -->
          <InputText v-else :model-value="row.value != null ? String(row.value) : null"
            @update:model-value="(value) => (row.value = value ?? undefined)" :name="`institutional-${index}`"
            inputClass="!border-[#D8D8D8]" />
        </template>

        <!-- Two Column -->
        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="field in row.fields" :key="field.label">
              <p class="text-[14px] font-medium text-[#252547] mb-3">
                {{ field.label }}
              </p>

              <InputText :model-value="String(field.value)" @update:model-value="(value) => (field.value = value ?? '')"
                :name="`institutional-field-${index}-${field.label}`"
                inputClass="!border-[#D8D8D8] " />

              <p v-if="field.suffix" class="mt-2 text-[12px] text-[#252547]">
                {{ field.suffix }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

export interface InstitutionalField {
  label: string
  value: string | number
  suffix?: string
}

export interface InstitutionalRow {
  fullWidth?: boolean
  type?: 'text' | 'select'
  label?: string
  value?: string | number
  options?: string[]
  fields?: InstitutionalField[]
}

defineProps<{
  title: string
  icon: Component
  items: InstitutionalRow[]
}>()
</script>