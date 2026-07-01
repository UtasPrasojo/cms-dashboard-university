<template>
    <div class="rounded-3xl bg-white p-4 mt-4 mr-4">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-[14px] font-medium text-primary-900">
                {{ title }}
            </h2>

            <InformationCircleIcon class="w-4 h-4 text-primary-900" />
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-2 gap-2">
            <div v-for="(industry, index) in industries" :key="index"
                class="rounded-3xl border border-gray-100 bg-gray-50 px-4 py-4">
                <p class="text-[12px] text-gray-500">
                    {{ industry.name }}
                </p>

                <h3 class="mt-3 text-[24px] leading-none font-medium text-primary-900">
                    {{ industry.total }}
                </h3>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { InformationCircleIcon } from '@heroicons/vue/24/outline'

interface Industry {
    name: string
    total: string
}

defineProps<{
    title: string
    industries: Industry[]
}>()

</script>