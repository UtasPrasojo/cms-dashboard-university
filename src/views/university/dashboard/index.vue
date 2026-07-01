<template>
    <div class="relative min-h-screen overflow-hidden bg-[#F0F3FF]">

        <div class="absolute inset-0 pointer-events-none">
            <div class="absolute top-4 left-0 w-[300px] h-[300px] rounded-full bg-primary-500 opacity-30 blur-3xl">
            </div>

            <div class="absolute bottom-4 right-0 w-[300px] h-[300px] rounded-full bg-primary-500 opacity-30 blur-3xl">
            </div>
        </div>

        <!-- Content Layer -->
        <div class="relative z-10 w-full flex">
            <div class="w-3/4 flex flex-col p-4">
                <div class="flex gap-4 mb-4">
                    <DashboardCardInformation v-for="(card, index) in cards" :key="index" :title="card.title"
                        :value="card.value" :description="card.description" :icon="card.icon" />
                </div>
                <div class="grid grid-cols-3 p-4 bg-base-white rounded-3xl gap-4">
                    <DashboardCardTalentMatrix v-for="(card, index) in cardsTalent" :key="index" v-bind="card" />

                </div>
            </div>

            <div class="w-1/4"></div>
        </div>
    </div>
</template>
<script setup lang="ts">

import {
    UserCircleIcon,
    AcademicCapIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
} from '@heroicons/vue/24/outline'
import {
    SparklesIcon,
    StarIcon,
    TrophyIcon,
    HandThumbUpIcon,
    ExclamationTriangleIcon,
} from '@heroicons/vue/24/solid'


const cards = [
    {
        title: 'Mahasiswa Terdaftar',
        value: '5.847',
        description: '284 lebih banyak dari bulan lalu',
        icon: UserCircleIcon,
    },
    {
        title: 'CV Lengkap',
        value: '2.143',
        description: '125 lebih banyak dari bulan lalu',
        icon: ClipboardDocumentListIcon,
    },
    {
        title: 'Selesai Asesmen',
        value: '38',
        description: '5 program baru bulan ini',
        icon: AcademicCapIcon,
    },
    {
        title: 'Aktif di talent Pool',
        value: '92%',
        description: 'Naik 7% dari bulan lalu',
        icon: ChartBarIcon,
    },
]
const cardsTalent = [
    {
        title: 'Potensi tersembunyi',
        value: 147,
        iq: 'IQ tinggi',
        ipk: 'IPK rendah',
        icon: SparklesIcon,
        variant: 'orange',
    },
    {
        title: 'Bintang berkembang',
        value: 312,
        iq: 'IQ tinggi',
        ipk: 'IPK sedang',
        icon: StarIcon,
        variant: 'blue',
    },
    {
        title: 'Talent unggulan',
        value: 172,
        iq: 'IQ tinggi',
        ipk: 'IPK tinggi',
        icon: ExclamationTriangleIcon,
        variant: 'green',
    },
    {
        title: 'Potensi tersembunyi',
        value: 378,
        iq: 'IQ sedang',
        ipk: 'IPK rendah',
        variant: 'default',
    },
    {
        title: 'Potensi tersembunyi',
        value: 1124,
        iq: 'IQ sedang',
        ipk: 'IPK sedang',
        variant: 'default',
    },
    {
        title: 'Potensi tersembunyi',
        value: 392,
        iq: 'IQ sedang',
        ipk: 'IPK tinggi',
        icon: TrophyIcon,
        variant: 'purple',
    },
    {
        title: 'Prioritas intervensi',
        value: 213,
        iq: 'IQ rendah',
        ipk: 'IPK rendah',
        icon: HandThumbUpIcon,
        variant: 'red',
    },
    {
        title: 'Potensi tersembunyi',
        value: 287,
        iq: 'IQ rendah',
        ipk: 'IPK sedang',
        variant: 'default',
    },
    {
        title: 'Potensi tersembunyi',
        value: 132,
        iq: 'IQ rendah',
        ipk: 'IPK tinggi',
        variant: 'default',
    },
]
</script>