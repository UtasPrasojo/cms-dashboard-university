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
                <DashboardCardTalentMatrix :cards="cardsTalent" />
                <DashboardCardArchetypePersonality />
            </div>

            <div class="w-1/4 h-full flex flex-col">
                <DashboardCardCampusReferal :title="referral.title" :code="referral.code"
                    :description="referral.description" />
                <DashboardCardFindIndustry title="Industri Paling Aktif Mencari" :industries="industries" />
                <div class="flex-1 flex flex-col">
                    <DashboardCardTalentpoolStatistic title="Statistik Talent Pool" :talentpool="talentpool" />
                </div>
            </div>
        </div>
        <div class="relative z-10 w-full flex">
            <div class="w-full grid grid-cols-2 gap-4 px-4">
                <DashboardCardCognitiveProfile :summary="cognitiveSummary" :highlights="highlightAspects"
                    :bars="cognitiveBars" />
                <DashboardCardCareerRead :score="careerReadiness.score" :status="careerReadiness.status"
                    :description="careerReadiness.description" :strongest="careerReadiness.strongest"
                    :improvement="careerReadiness.improvement" />
            </div>
        </div>
        <div class="relative z-10 w-full px-4 mt-4 mb-4">
            <DashboardCardDistribution :data="prodiDistribution" />
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
import type { TalentCard } from '@/components/Dashboard/Card/TalentMatrix.vue'
import { CpuChipIcon } from '@heroicons/vue/24/outline'
import type { ProdiDistribution } from '@/components/Dashboard/Card/Distribution.vue'


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
const cardsTalent: TalentCard[] = [
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

const referral = {
    title: 'Kode referral kampus',
    code: 'UDGH8738',
    description:
        'Kode referral kampus digunakan oleh mahasiswa untuk terhubung atau terafiliasi dengan kampus.',
}

const industries = [
    {
        name: 'Teknologi & IT',
        total: '1.247',
    },
    {
        name: 'Perbankan',
        total: '894',
    },
    {
        name: 'Konsultan',
        total: '567',
    },
    {
        name: 'Media & Kreatif',
        total: '312',
    },
]
const talentpool = [
    {
        name: 'Mahasiswa aktif di Talent Pool',
        total: '1.247',
    },
    {
        name: 'Total kunjungan profile oleh perusahaan',
        total: '894',
    },
    {
        name: 'Rata-rata profile dilihat per mahasiswa',
        total: '567',
    },
    {
        name: 'Mahasiswa masuk shortlist perusahaan',
        total: '312',
    },
]



const cognitiveSummary = {
    averageIQ: 112,
    icon: CpuChipIcon,
}

const highlightAspects = [
    {
        rank: 1,
        title: 'Verbal',
    },
    {
        rank: 2,
        title: 'Penalaran Abstrak',
    },
    {
        rank: 3,
        title: 'Spasial',
    },
]

const cognitiveBars = [
    {
        label: 'Verbal',
        value: 115,
        active: true,
    },
    {
        label: 'P. Logis',
        value: 80,
        active: false,
    },
    {
        label: 'P. Abstrak',
        value: 118,
        active: true,
    },
    {
        label: 'Berpikir\nKritis',
        value: 104,
        active: false,
    },
    {
        label: 'Penguasaan\nNumerik',
        value: 20,
        active: false,
    },
    {
        label: 'Komputasi',
        value: 106,
        active: false,
    },
    {
        label: 'Wacana',
        value: 101,
        active: false,
    },
    {
        label: 'Spasial',
        value: 111,
        active: true,
    },
]

const careerReadiness = {
    score: 80,

    status: 'Cukup Siap',

    description:
        'Rata-rata mahasiswa memiliki fondasi yang baik, namun masih perlu pengembangan pada kelengkapan CV dan keselarasan minat-bakat.',

    strongest: {
        title: 'Skor Kognitif',
        subtitle: 'Rata-rata IQ',
        value: '112',
    },

    improvement: {
        title: 'Kelengkapan CV',
        subtitle: 'Belum lengkap CV',
        value: '32%',
    },
}

const prodiDistribution: ProdiDistribution[] = [
  {
    name: 'Teknik Informatika',
    totalMahasiswa: 1247,
    cvLengkap: 82,
    selesaiAsesmen: 78,
    careerReadiness: 923,
    alignmentMinat: 74,
    posisi: 'baik',
  },
  {
    name: 'Psikologi',
    totalMahasiswa: 743,
    cvLengkap: 76,
    selesaiAsesmen: 71,
    careerReadiness: 498,
    alignmentMinat: 67,
    posisi: 'baik',
  },
  {
    name: 'Ilmu Hukum',
    totalMahasiswa: 892,
    cvLengkap: 23,
    selesaiAsesmen: 58,
    careerReadiness: 518,
    alignmentMinat: 52,
    posisi: 'perhatian',
  },
  {
    name: 'Komunikasi',
    totalMahasiswa: 621,
    cvLengkap: 79,
    selesaiAsesmen: 68,
    careerReadiness: 391,
    alignmentMinat: 63,
    posisi: 'perhatian',
  },
  {
    name: 'Akuntansi',
    totalMahasiswa: 344,
    cvLengkap: 61,
    selesaiAsesmen: 49,
    careerReadiness: 175,
    alignmentMinat: 44,
    posisi: 'prioritas',
  },
]
</script>