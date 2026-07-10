<template>
    <div class="rounded-3xl bg-white p-4 mt-4 mr-4 h-full flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6 px-2">
            <h2 class="text-[14px] font-medium text-primary-900">
                {{ title }}
            </h2>

             <IconInformation class="w-4 h-4 text-primary-900" />
        </div>

        <!-- Grid -->
        <div class="grid grid-rows-4 gap-2 flex-1">
            <div v-for="(industry, index) in talentpool" :key="index"
                class="rounded-3xl border border-gray-100 bg-gray-50 px-4 py-4 flex flex-col justify-center">
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

interface talentpool {
    name: string
    total: string
}

defineProps<{
    title: string
    talentpool: talentpool[]
}>()

</script>