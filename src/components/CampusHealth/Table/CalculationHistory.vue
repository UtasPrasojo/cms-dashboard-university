<template>
    <div class="rounded-[32px] bg-base-white border border-[#ECECEC] p-6">
        <div class="flex items-center justify-between mb-4">
            <p class="text-[14px] font-medium text-[#252547]">
                Riwayat Perhitungan
            </p>

            <InformationCircleIcon class="w-6 h-6 text-[#252547]" />
        </div>

        <TbMain>
            <thead>
                <TbRow type="head" class="!bg-[#282828] !text-white">
                    <TbHead>Periode</TbHead>
                    <TbHead align="center">Campus Talent Index</TbHead>
                    <TbHead align="center">Academic</TbHead>
                    <TbHead align="center">Employability</TbHead>
                    <TbHead align="center">Career Readiness</TbHead>
                    <TbHead align="center">Perubahan</TbHead>
                </TbRow>
            </thead>

            <tbody>
                <TbRow v-for="(item, index) in items" :key="index">
                    <TbData>
                        <p class="font-medium text-[#252547]">{{ item.semester }}</p>
                        <p class="text-text-300">{{ item.year }}</p>
                    </TbData>

                    <TbData align="center">{{ item.talentIndex }}</TbData>
                    <TbData align="center">{{ item.academic }}</TbData>
                    <TbData align="center">{{ item.employability }}</TbData>
                    <TbData align="center">{{ item.careerReadiness }}</TbData>

                    <TbData align="center">
                        <span
                            v-if="item.change === null"
                            class="inline-flex items-center gap-1 rounded-full bg-primary-500 px-4 py-1.5 text-[12px] font-medium text-white"
                        >
                            Baseline
                        </span>

                        <span
                            v-else
                            class="inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-[12px] font-medium text-white"
                            :class="item.change >= 0 ? 'bg-success-500' : 'bg-[#EB5757]'"
                        >
                            {{ Math.abs(item.change) }}
                            <ArrowUpIcon v-if="item.change >= 0" class="w-3 h-3" />
                            <ArrowDownIcon v-else class="w-3 h-3" />
                        </span>
                    </TbData>
                </TbRow>
            </tbody>
        </TbMain>
    </div>
</template>

<script setup lang="ts">
import { InformationCircleIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/outline'

export interface CalculationHistoryItem {
    semester: string
    year: string
    talentIndex: number
    academic: number
    employability: number
    careerReadiness: number
    change: number | null
}

defineProps<{
    items: CalculationHistoryItem[]
}>()
</script>
