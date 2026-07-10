<template>
    <div class="relative min-h-screen overflow-hidden ">
        <div class="absolute inset-0 pointer-events-none">
            <!-- <div class="absolute top-4 left-0 w-[300px] h-[300px] rounded-full bg-primary-500 opacity-30 blur-3xl">
            </div> -->

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
                <DashboardCardArchetypePersonality :data="dashboardStore.archetypePersonality" />
            </div>

            <div class="w-1/4 pb-4 flex flex-col">
                <DashboardCardCampusReferal :title="referral.title" :code="dashboardStore.referralCode?.code ?? ''"
                    :description="referral.description" />
                <DashboardCardFindIndustry title="Industri Paling Aktif Mencari" :industries="industries" />
                <DashboardCardTalentpoolStatistic title="Statistik Talent Pool" :talentpool="talentpool"
                    class="flex-1" />
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
import { onMounted, computed } from 'vue'
import { useDashboardStore } from '@/stores/university/dashboard.store'


import UserIcon from '@/components/Icon/Dashboard/User.vue'
import File from '@/components/Icon/Dashboard/File.vue'
import Book from '@/components/Icon/Dashboard/Book.vue'
import Search from '@/components/Icon/Dashboard/Search.vue'
import Sinus from '@/components/Icon/Dashboard/Sinus.vue'
import Star from '@/components/Icon/Dashboard/Stars.vue'
import Thropy from '@/components/Icon/Dashboard/Trophy.vue'
import Like from '@/components/Icon/Dashboard/Like.vue'
import Warning from '@/components/Icon/Dashboard/Warning.vue'
import Idea from '@/components/Icon/Dashboard/Idea.vue'


import type { TalentCard } from '@/components/Dashboard/Card/TalentMatrix.vue'
import { CpuChipIcon } from '@heroicons/vue/24/outline'
import type { ProdiDistribution } from '@/components/Dashboard/Card/Distribution.vue'
import type { PosisiNineBox } from '@/stores/university/type/distribution_student'


const dashboardStore = useDashboardStore()





const dummyCards = [
    {
        title: 'Mahasiswa Terdaftar',
        value: '5.847',
        description: '284 lebih banyak dari bulan lalu',
        icon: UserIcon,
    },
    {
        title: 'CV Lengkap',
        value: '21%',
        description: '125 lebih banyak dari bulan lalu',
        icon: File,
    },
    {
        title: 'Selesai Asesmen',
        value: '38%',
        description: '5 program baru bulan ini',
        icon: Book,
    },
    {
        title: 'Aktif di talent Pool',
        value: '92%',
        description: 'Naik 7% dari bulan lalu',
        icon: Search,
    },
]

const cards = computed(() => {
    const students = dashboardStore.percentageStats?.students

    if (!students) {
        return dummyCards
    }

    const totalRegistration = Number(students.total_registration)

    const registrationDiff =
        Number(students.current_month_registration) - Number(students.previous_month_registration)
    const registrationDiffLabel = registrationDiff >= 0 ? 'lebih banyak' : 'lebih sedikit'

    const toPercentage = (value: string) => {
        if (!totalRegistration) {
            return '0%'
        }
        return `${Math.round((Number(value) / totalRegistration) * 100)}%`
    }

    return [
        {
            title: 'Mahasiswa Terdaftar',
            value: students.total_registration,
            description: `${Math.abs(registrationDiff)} ${registrationDiffLabel} dari bulan lalu`,
            icon: UserIcon,
        },
        {
            title: 'CV Lengkap',
            value: toPercentage(students.total_cv_completed),
            description: `${students.total_cv_completed} dari ${students.total_registration} mahasiswa`,
            icon: File,
        },
        {
            title: 'Selesai Asesmen',
            value: toPercentage(students.total_completed_assessment),
            description: `${students.total_completed_assessment} dari ${students.total_registration} mahasiswa`,
            icon: Book,
        },
        {
            title: 'Aktif di talent Pool',
            value: toPercentage(students.total_active_talent_pool),
            description: `${students.total_active_talent_pool} dari ${students.total_registration} mahasiswa`,
            icon: Search,
        },
    ]
})
const talentMatrixMeta = [
    [
        { title: 'Potensi tersembunyi', iq: 'IQ tinggi', ipk: 'IPK rendah', icon: Sinus, variant: 'orange' as const },
        { title: 'Bintang berkembang', iq: 'IQ tinggi', ipk: 'IPK sedang', icon: Star, variant: 'blue' as const },
        { title: 'Talent unggulan', iq: 'IQ tinggi', ipk: 'IPK tinggi', icon: Thropy, variant: 'green' as const },
    ],
    [
        { title: 'Potensi tersembunyi', iq: 'IQ sedang', ipk: 'IPK rendah', variant: 'default' as const },
        { title: 'Potensi tersembunyi', iq: 'IQ sedang', ipk: 'IPK sedang', variant: 'default' as const },
        { title: 'Potensi tersembunyi', iq: 'IQ sedang', ipk: 'IPK tinggi', icon: Like, variant: 'purple' as const },
    ],
    [
        { title: 'Prioritas intervensi', iq: 'IQ rendah', ipk: 'IPK rendah', icon: Warning, variant: 'red' as const },
        { title: 'Potensi tersembunyi', iq: 'IQ rendah', ipk: 'IPK sedang', variant: 'default' as const },
        { title: 'Potensi tersembunyi', iq: 'IQ rendah', ipk: 'IPK tinggi', variant: 'default' as const },
    ],
]
const cardsTalent = computed<TalentCard[]>(() => {
    const matrix = dashboardStore.nineboxMatrix

    if (!matrix || matrix.length === 0) {
        return talentMatrixMeta.flat().map((meta, index) => ({
            ...meta,
            value: [147, 312, 172, 378, 1124, 392, 213, 287, 132][index],
        }))
    }

    return talentMatrixMeta.flatMap((row, rowIndex) =>
        row.map((meta, colIndex) => {
            const raw = matrix[colIndex]?.[2 - rowIndex]
            return {
                ...meta,
                value: raw == null ? 0 : Number(raw), 
            }
        })
    )
})


const referral = {
    title: 'Kode referral kampus',
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



const dummyCognitiveSummary = {
    averageIQ: 112,
    icon: Idea,
}

const dummyHighlightAspects = [
    { rank: 1, title: 'Verbal' },
    { rank: 2, title: 'Penalaran Abstrak' },
    { rank: 3, title: 'Spasial' },
]

const dummyCognitiveBars = [
    { label: 'Verbal', value: 115, active: true },
    { label: 'P. Logis', value: 80, active: false },
    { label: 'P. Abstrak', value: 118, active: true },
    { label: 'Berpikir\nKritis', value: 104, active: false },
    { label: 'Penguasaan\nNumerik', value: 20, active: false },
    { label: 'Komputasi', value: 106, active: false },
    { label: 'Wacana', value: 101, active: false },
    { label: 'Spasial', value: 111, active: true },
]

const sortedCognitiveDetails = computed(() => {
    const details = dashboardStore.cognitiveProfile?.details ?? []
    return [...details].sort((a, b) => Number(b.avg_score) - Number(a.avg_score))
})

const top3CognitiveIds = computed(() => {
    return new Set(sortedCognitiveDetails.value.slice(0, 3).map((d) => d.ccat_group_id))
})

const cognitiveSummary = computed(() => {
    const avgScore = dashboardStore.cognitiveProfile?.avg_score

    if (!avgScore) {
        return dummyCognitiveSummary
    }

    return {
        averageIQ: Math.round(Number(avgScore)),
        icon: Idea,
    }
})

const highlightAspects = computed(() => {
    const details = dashboardStore.cognitiveProfile?.details

    if (!details || details.length === 0) {
        return dummyHighlightAspects
    }

    return sortedCognitiveDetails.value.slice(0, 3).map((detail, index) => ({
        rank: index + 1,
        title: detail.name,
    }))
})

const cognitiveBars = computed(() => {
    const details = dashboardStore.cognitiveProfile?.details

    if (!details || details.length === 0) {
        return dummyCognitiveBars
    }

    return details.map((detail) => ({
        label: detail.name,
        value: Math.round(Number(detail.avg_score)),
        active: top3CognitiveIds.value.has(detail.ccat_group_id),
    }))
})

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

const dummyProdiDistribution: ProdiDistribution[] = [
    {
        name: 'Teknik Informatika',
        totalMahasiswa: 1247,
        cvLengkap: 82,
        selesaiAsesmen: 78,
        careerReadiness: 923,
        alignmentMinat: 74,
        posisi: 'talent unggulan',
    },
    {
        name: 'Psikologi',
        totalMahasiswa: 743,
        cvLengkap: 76,
        selesaiAsesmen: 71,
        careerReadiness: 498,
        alignmentMinat: 67,
        posisi: 'bintang berkembang',
    },
    {
        name: 'Ilmu Hukum',
        totalMahasiswa: 892,
        cvLengkap: 23,
        selesaiAsesmen: 58,
        careerReadiness: 518,
        alignmentMinat: 52,
        posisi: 'profil solid',
    },
    {
        name: 'Komunikasi',
        totalMahasiswa: 621,
        cvLengkap: 79,
        selesaiAsesmen: 68,
        careerReadiness: 391,
        alignmentMinat: 63,
        posisi: 'bakat terpendam',
    },
    {
        name: 'Akuntansi',
        totalMahasiswa: 344,
        cvLengkap: 61,
        selesaiAsesmen: 49,
        careerReadiness: 175,
        alignmentMinat: 44,
        posisi: 'prioritas intervensi',
    },
]


const prodiDistribution = computed<ProdiDistribution[]>(() => {
    const distribution = dashboardStore.distributionStudent

    if (!distribution || distribution.length === 0) {
        return dummyProdiDistribution
    }

    return distribution.map((item) => ({
        name: item.major,
        totalMahasiswa: item.total_student,
        cvLengkap: item.total_cv_completed,
        selesaiAsesmen: item.total_completed_assessment,
        careerReadiness: item.total_active_talent_pool,
        alignmentMinat: 0,
        posisi: 'profil solid',
    }))
})

onMounted(() => {
    dashboardStore.getReferralCode()
    dashboardStore.getDistributionStudent()
    dashboardStore.getPercentageStats()
    dashboardStore.getCognitiveProfile()
    dashboardStore.getArchetypePersonality()
    dashboardStore.getNineboxMatrix()
})
</script>