<template>
  <div class="bg-white rounded-3xl p-4">

    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-[14px] font-medium">
        Profil Kognitif
      </h2>

      <InformationCircleIcon class="w-6 h-6 text-primary-900" />
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-3 gap-4 mt-6">

      <!-- IQ -->
      <div
        class="border rounded-3xl p-6 flex justify-between items-center"
      >
        <div>
          <p class="text-[12px] font-medium">
            IQ Rata-rata
          </p>

          <p class="text-[18px] font-semibold mt-2">
            {{ summary.averageIQ }}
          </p>
        </div>

        <div
          class="w-14 h-14 rounded-full border flex items-center justify-center"
        >
          <component
            :is="summary.icon"
            class="w-6 h-6 text-primary-900"
          />
        </div>
      </div>

      <!-- Highlight -->
      <div
        class="col-span-2 border rounded-3xl p-6"
      >
        <p class="text-[12px] font-medium">
          Aspek menonjol
        </p>

        <div class="flex gap-8 mt-4">

          <div
            v-for="item in highlights"
            :key="item.rank"
            class="flex items-center gap-3"
          >
            <div
              class="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-primary-500 font-semibold text-[12px]"
            >
              {{ item.rank }}
            </div>

            <span class="text-[12px]">
              {{ item.title }}
            </span>

          </div>

        </div>
      </div>

    </div>

    <!-- Bars -->
    <div
      class="grid grid-cols-8 gap-6 mt-8"
    >
      <BarPilBar
        v-for="bar in bars"
        :key="bar.label"
        :label="bar.label"
        :value="bar.value"
        :active="bar.active"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { InformationCircleIcon } from '@heroicons/vue/24/outline'



interface Summary {
  averageIQ: number
  icon: any
}

interface Highlight {
  rank: number
  title: string
}

interface Bar {
  label: string
  value: number
  active: boolean
}

defineProps<{
  summary: Summary
  highlights: Highlight[]
  bars: Bar[]
}>()
</script>