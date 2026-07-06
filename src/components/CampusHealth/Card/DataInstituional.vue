<template>
  <div class="rounded-[28px] bg-base-white border border-[#ECECEC] p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <div
          class="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center"
        >
          <component
            :is="icon"
            class="w-10 h-10 text-primary-500"
          />
        </div>

        <h2 class="text-[28px] font-medium text-[#252547]">
          {{ title }}
        </h2>
      </div>

      <button
        class="w-8 h-8 rounded-full border-2 border-[#252547] flex items-center justify-center"
      >
        <span class="text-sm font-semibold">i</span>
      </button>
    </div>

    <!-- Content -->
    <div class="space-y-8">
      <!-- Full Width -->
      <div
        v-for="(row, index) in items"
        :key="index"
      >
        <template v-if="row.fullWidth">
          <p class="text-[18px] font-medium text-[#252547] mb-3">
            {{ row.label }}
          </p>

          <!-- Dropdown -->
          <select
            v-if="row.type === 'select'"
            class="w-full h-24 rounded-[24px] border border-[#D8D8D8] px-7 text-[24px] text-[#3D3D3D] bg-white outline-none"
          >
            <option
              v-for="option in row.options"
              :key="option"
              :selected="option === row.value"
            >
              {{ option }}
            </option>
          </select>

          <!-- Input Style -->
          <InputText
            v-else
            :model-value="row.value != null ? String(row.value) : null"
            @update:model-value="(value) => (row.value = value ?? undefined)"
            :name="`institutional-${index}`"
            inputClass="!h-24 !rounded-[24px] !border-[#D8D8D8] !px-7 !text-[24px] !text-[#3D3D3D] !bg-transparent"
          />
        </template>

        <!-- Two Column -->
        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="field in row.fields"
              :key="field.label"
            >
              <p class="text-[18px] font-medium text-[#252547] mb-3">
                {{ field.label }}
              </p>

              <InputText
                :model-value="String(field.value)"
                @update:model-value="(value) => (field.value = value ?? '')"
                :name="`institutional-field-${index}-${field.label}`"
                inputClass="!h-24 !rounded-[24px] !border-[#D8D8D8] !px-7 !text-[24px] !text-[#A8A8A8] !bg-transparent"
              />

              <p
                v-if="field.suffix"
                class="mt-2 text-lg text-[#252547]"
              >
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