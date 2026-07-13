<template>
  <div class="bg-white rounded-3xl p-4">

    <!-- Header -->
    <div class="flex justify-between items-center mb-8 px-2">
      <h2 class="text-[14px] font-medium text-primary-900">
        Career Readiness Index
      </h2>

      <IconInformation class="w-4 h-4 text-primary-900" />
    </div>

    <!-- Top Section -->
    <div class="flex gap-10 items-center">

      <!-- Circle -->
      <div class="relative w-[280px] h-[280px] shrink-0">

        <svg class="w-full h-full -rotate-90">

          <!-- Background -->
          <circle cx="140" cy="140" r="105" stroke="#DDF7F5" stroke-width="26" fill="transparent" />

          <!-- Progress -->
          <circle cx="140" cy="140" r="105" :stroke="progressColor" stroke-width="26" stroke-linecap="round"
            fill="transparent" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset" />

        </svg>

        <div class="absolute inset-0 flex items-center justify-center flex-col">
          <div class="flex items-end">
            <span class="text-[32px] font-semibold text-primary-900">
              {{ score }}
            </span>

            <span class="text-[32] text-gray-400 mb-2">
              /100
            </span>
          </div>
        </div>

      </div>

      <!-- Description -->
      <div class="flex-1">

        <h3 class="text-[18px] font-medium text-primary-900">
          {{ status }}
        </h3>

        <p class="mt-4 text-[12px] leading-9 text-gray-500">
          {{ description }}
        </p>

      </div>

    </div>

    <!-- Bottom Cards -->
    <div class="grid grid-cols-2 gap-6 mt-8">

      <div class="rounded-3xl bg-[#F9FBFE] border border-gray-100 p-6">
        <p class="text-[12px] text-primary-900">
          Terkuat
        </p>

        <h3 class="text-[18px] font-medium mt-2">
          {{ strongest.title }}
        </h3>

        <p class="text-[18px] mt-6">
          {{ strongest.subtitle }}

          <span class="text-primary-500">
            {{ strongest.value }}
          </span>
        </p>

      </div>

      <div class="rounded-3xl bg-[#F9FBFE] border border-gray-100 p-6">
        <p class="text-[12px] text-primary-900">
          Perlu ditingkatkan
        </p>

        <h3 class="text-[18px] font-medium mt-2">
          {{ improvement.title }}
        </h3>

        <p class="text-[18px] mt-6">

          <span class="text-primary-500">
            {{ improvement.value }}
          </span>

          {{ improvement.subtitle }}
        </p>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface DetailCard {
  title: string
  subtitle: string
  value: string | number
}

const props = defineProps<{
  score: number
  status: string
  description: string
  strongest: DetailCard
  improvement: DetailCard
}>()

const radius = 105
const circumference = 2 * Math.PI * radius

const dashOffset = computed(() => {
  return circumference - (props.score / 100) * circumference
})

const progressColor = '#14C8B4'
</script>