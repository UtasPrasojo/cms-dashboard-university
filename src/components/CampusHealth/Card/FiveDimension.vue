<template>
  <div class="rounded-[32px] bg-base-white border border-[#ECECEC] p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <p class="text-[14px] font-medium text-[#252547]">
        Profil 5 Dimensi
      </p>

      <InformationCircleIcon class="w-6 h-6 text-[#252547]" />
    </div>

    <div class="grid grid-cols-2 gap-4 items-center">
      <!-- Radar Chart -->
      <div class="flex justify-center">
        <BarRadarChart
          :labels="chartLabels"
          :data="chartData"
          :previous-data="previousData"
          current-label="Semester Ini"
          previous-label="Semester Lalu"
          :size="400"
        />
      </div>

      <!-- Right Panel -->
      <div class="flex flex-col gap-2">
        <div
          v-for="(item,index) in items"
          :key="index"
          class="rounded-3xl border border-[#ECECEC] bg-[#FAFBFE] p-3"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-3 h-3 rounded-full bg-primary-500"></div>

            <p class="text-[14px] font-medium text-[#252547]">
              {{ item.title }}
            </p>

            <div
              class="rounded-full px-4 py-1 text-white text-[12px] font-medium"
              :class="badgeColor(item.score)"
            >
              {{ item.score }}
            </div>
          </div>

          <p class="text-[12px] leading-7 text-[#666]">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'

interface DimensionItem {
  title:string
  score:number
  description:string
}

const props = defineProps<{
  items: DimensionItem[]
  previousData:number[]
}>()

const chartLabels = computed(() =>
  props.items.map(item => item.title)
)

const chartData = computed(() =>
  props.items.map(item => item.score)
)

const badgeColor = (score:number)=>{
  if(score>=80) return 'bg-[#27AE60]'
  if(score>=60) return 'bg-[#FF9F43]'
  return 'bg-[#EB5757]'
}
</script>