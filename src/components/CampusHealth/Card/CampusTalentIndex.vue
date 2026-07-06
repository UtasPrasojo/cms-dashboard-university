<template>
    <div class="relative overflow-hidden rounded-3xl bg-[#050505] px-7 py-6 text-white">
        <!-- Background Gradient -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_left,#2B245A_0%,#050505_45%,#1B173D_100%)]">
        </div>

        <!-- Grid Background (Right Side Only) -->
        <div class="absolute top-0 right-0 h-full w-1/3 bg-right bg-cover bg-no-repeat " :style="{
            opacity: 0.5,
            backgroundImage: `url(${GridImage})`,
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,.4) 20%, rgba(0,0,0,.8) 40%, black 70%)',
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,.4) 25%, rgba(0,0,0,.8) 40%, black 80%)'
        }"></div>

        <!-- Optional Purple Glow -->
        <div
            class="absolute top-1/2 right-20 -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-[#6E59F7]/15 blur-[120px]">
        </div>

        <!-- Content -->
        <div class="relative z-10 flex justify-between items-start">
            <!-- Left -->
            <div class="w-2/3">
                <div class="flex items-center gap-4 mb-8">
                    <div
                        class="w-12 h-12 rounded-full bg-[#6E59F7] border-2 border-white flex items-center justify-center">
                        <component :is="icon" class="w-6 h-6 text-white" />
                    </div>

                    <p class="text-[14px] font-medium">
                        {{ title }}
                    </p>
                </div>

                <div class="mb-4">
                    <span class="text-[24px] font-light leading-none">
                        {{ score }}
                    </span>
                    <span class="text-[14px] text-white/70">
                        /100
                    </span>
                </div>

                <div class="inline-flex items-center gap-2 rounded-full bg-[#00C7A5] px-4 py-2 mb-3">
                    <div class="w-1.5 h-1.5 rounded-full bg-white"></div>

                    <span class="text-[12px] font-medium">
                        {{ status }}
                    </span>
                </div>

                <p class="text-[12px] text-white/90 leading-relaxed">
                    {{ description }}
                </p>
            </div>

            <!-- Right -->
            <div class="relative flex justify-end  w-1/3">
                <!-- Circle Chart -->
                <div class="relative w-[140px] h-[140px]">
                    <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">

                        <!-- Background -->
                        <circle cx="80" cy="80" r="60" fill="none" stroke="#EEECFE" stroke-width="16" />

                        <!-- Progress -->
                        <circle cx="80" cy="80" r="60" fill="none" stroke="#6E59F7" stroke-width="16"
                            stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset" />
                    </svg>

                    <!-- Score -->
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="text-center">
                            <p class="text-[18px] font-medium">
                                {{ score }}
                                <span class="text-[12px] text-white/60">/100</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import GridImage from '@/assets/images/dashboard/grid.png'

const props = defineProps<{
    title: string
    score: number
    status: string
    description: string
    icon: Component
}>()

const circumference = 2 * Math.PI * 60

const dashOffset = computed(() => {
    return circumference * (1 - props.score / 100)
})
</script>