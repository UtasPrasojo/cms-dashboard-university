<template>
    <div class="relative overflow-hidden rounded-3xl p-4 bg-base-white border border-[#ECECEC]">

        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-[14px] font-medium text-[#252547]">
                {{ title }}
            </h2>

            <button class="w-4 h-4 rounded-full border-2 border-[#252547] flex items-center justify-center">
                <span class="text-sm font-semibold">i</span>
            </button>
        </div>

        <!-- Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div v-for="(item, index) in items" :key="index" 
                class="rounded-3xl bg-gray-50 border border-[#ECECEC] p-4">
                <p class="text-gray-500 text-[12px] mb-3">
                    {{ item.title }}
                </p>

                <InputText :model-value="String(item.value)" @update:model-value="(value) => (item.value = value ?? '')"
                    :name="`automated-${index}`"
                    inputClass="!h-auto !p-0 !border-0 !rounded-none  !text-[#252547] !text-[24px] !font-medium" />
            </div>
        </div>
        <div
            class="absolute bottom-0 -right-3 w-[200px] h-[200px] rounded-full bg-primary-500 opacity-40 blur-3xl -z-0">
        </div>
    </div>
</template>
<script setup lang="ts">
interface AutoDataItem {
    title: string
    value: string | number
}

defineProps<{
    title: string
    items: AutoDataItem[]
}>()
</script>