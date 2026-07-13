<template>
    <div class="bg-base-white p-4 rounded-3xl mb-4">
        <div class="flex justify-between items-center pb-4">
            <p>9-Box Talent Matrix</p>
            <IconDashboardArrow class="w-4 h-4" />
        </div>
        <div class="flex gap-3">
            <!-- Label vertikal: IQ Tinggi / Sedang / Rendah -->
            <div class="flex flex-col justify-between pt-8 pb-16">
                <span class="[writing-mode:vertical-rl] rotate-180 text-[12px] text-primary-900 whitespace-nowrap">
                    IQ Tinggi
                </span>
                <span class="[writing-mode:vertical-rl] rotate-180 text-[12px] text-primary-900 whitespace-nowrap">
                    IQ Sedang
                </span>
                <span class="[writing-mode:vertical-rl] rotate-180 text-[12px] text-primary-900 whitespace-nowrap">
                    IQ Rendah
                </span>
            </div>

            <div class="flex-1">
                <div class="grid grid-cols-3 gap-4">
                    <div v-for="(card, index) in cards" :key="index"
                        class="rounded-3xl p-5 h-full flex flex-col justify-between transition-all"
                        :class="getVariant(card.variant).bg">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-[12px] font-normal" :class="getVariant(card.variant).text">
                                    {{ card.title }}
                                </p>

                                <div class="mt-2 flex items-end gap-2">
                                    <h2 class="text-[24px] font-medium leading-none"
                                        :class="getVariant(card.variant).text">
                                        {{ card.value }}
                                    </h2>

                                    <span class="text-[12px] font-normal leading-none"
                                        :class="getVariant(card.variant).text">
                                        Mahasiswa
                                    </span>
                                </div>
                            </div>

                            <div v-if="card.icon" class="rounded-full p-[5px]"
                                :class="getVariant(card.variant).iconOuter">
                                <div class="w-11 h-11 rounded-full flex items-center justify-center shadow-sm"
                                    :class="getVariant(card.variant).iconBg">
                                    <component :is="card.icon" class="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <p class="text-[12px]" :class="getVariant(card.variant).text">
                            {{ card.iq }} • {{ card.ipk }}
                        </p>
                    </div>
                </div>

                <!-- Label horizontal: IPK Rendah / Sedang / Tinggi -->
                <div class="grid grid-cols-3 gap-4 mt-4">
                    <span class="text-[12px] text-primary-900 text-center">IPK Rendah</span>
                    <span class="text-[12px] text-primary-900 text-center">IPK Sedang</span>
                    <span class="text-[12px] text-primary-900 text-center">IPK Tinggi</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
export type TalentVariant = 'orange' | 'blue' | 'green' | 'purple' | 'red' | 'default'

export interface TalentCard {
    title: string
    value: string | number
    iq: string
    ipk: string
    icon?: object
    variant?: TalentVariant
}

defineProps<{
    cards: TalentCard[]
}>()

const variants = {
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    iconBg: 'bg-orange-400',
    iconOuter: 'bg-orange-400/20',
  },
  blue: {
    bg: 'bg-indigo-100',
    text: 'text-blue-700',
    iconBg: 'bg-blue-600',
    iconOuter: 'bg-blue-600/20',
  },
  green: {
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    iconBg: 'bg-teal-500',
    iconOuter: 'bg-teal-500/20',
  },
  purple: {
    bg: 'bg-violet-100',
    text: 'text-violet-500',
    iconBg: 'bg-violet-500',
    iconOuter: 'bg-violet-500/20',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-500',
    iconBg: 'bg-red-500',
    iconOuter: 'bg-red-500/20',
  },
  default: {
    bg: 'bg-[#F4F4F4]',
    text: 'text-slate-800',
    iconBg: 'bg-gray-400',
    iconOuter: 'bg-gray-400/20',
  },
}

const getVariant = (variant?: TalentVariant) => variants[variant ?? 'default']
</script>