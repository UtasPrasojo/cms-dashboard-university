<template>
    <div class="relative overflow-hidden rounded-[28px] bg-base-white p-3 flex justify-between items-center mt-4 mr-4">
        <div class="absolute bottom-0 -right-3 w-[200px] h-[200px] rounded-full bg-primary-500 opacity-40 blur-3xl -z-0">
        </div>

        <div class="relative z-10 flex flex-col">
            <div class="w-[42px] h-[42px] rounded-full bg-[#6F5CF8] flex items-center justify-center shadow-md">
                <IconDashboardTicket class="w-[20px] h-[20px] text-white" />
            </div>
            <p class="mt-6 text-[12px] text-gray-500 font-medium">
                {{ title }}
            </p>
            <div class="flex flex-row justify-between items-center">
                <h2 class="mt-2 text-[21px] leading-none font-semibold text-primary-900">
                    {{ code }}
                </h2>
                <button class="self-center rounded-full p-3 hover:bg-white transition" @click="copyCode">
                    <ClipboardDocumentIcon class="w-5 h-5 text-[#1F1B3D]" />
                </button>
            </div>

            <p class="mt-2 max-w-xl text-[12px] text-gray-500">
                {{ description }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import {

    ClipboardDocumentIcon,
    TicketIcon
} from '@heroicons/vue/24/outline'

interface Props {
    title: string
    code: string
    description: string
}

const props = defineProps<Props>()

const copyCode = async () => {
    await navigator.clipboard.writeText(props.code)
    alert('Kode referral berhasil disalin.')
}
</script>