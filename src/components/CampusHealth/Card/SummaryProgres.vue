<template>
    <div class="bg-base-white rounded-[28px] border border-[#ECECEC] p-4 flex flex-col gap-4">
        <div class="flex items-center gap-3">
            <div class="w-10.5 h-10.5 rounded-full bg-[#F7F7F9] flex items-center justify-center">
                <component :is="icon" class="w-6 h-6 text-[#252547]" />
            </div>


        </div>
        <p class="text-[14px] font-medium text-[#252547]">
            {{ title }}
        </p>

        <div>
            <p class="text-[12px] font-medium leading-none text-[#252547]">
                {{ score }}
            </p>

            <p class="text-[12px] mt-1" :class="statusColor">
                {{ status }}
            </p>
        </div>

        <BarProgressBar :value="score" :max="100" :color="progressColor" />
    </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'


const props = defineProps<{
    title: string
    score: number
    status: string
    icon: Component
}>()

const progressColor = computed((): "success" | "warning" | "danger" => {
    if (props.score >= 80) return "success"
    if (props.score >= 60) return "warning"
    return "danger"
})

const statusColor = computed(() => {
    if (props.score >= 80) return 'text-[#22C55E]'
    if (props.score >= 60) return 'text-[#F59E0B]'
    return 'text-[#EF4444]'
})
</script>