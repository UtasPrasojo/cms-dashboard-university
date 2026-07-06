<template>
    <div class="w-full p-4 justify-between">
        <p class="text-[21px] font-medium ">Campus Health Index</p>
    </div>
    <div class="flex flex-row items-stretch gap-4 px-4 pb-4">
        <div class="w-1/3 flex flex-col gap-4">
            <CampusHealthCardDataAutomated title="Data Otomatis Dari Jenjang" :items="autoData" />
            <CampusHealthCardDataAcademic title="Data Akademik" :icon="AcademicCapIcon" :items="academicData" />
            <CampusHealthCardDataEmployability title="Data Employability" :icon="BriefcaseIcon"
                :items="employabilityData" />
            <CampusHealthCardDataInstituional title="Data Institusional" :icon="ClipboardDocumentCheckIcon"
                :items="institutionalData" />
            <CampusHealthCardDataEcosystem title="Data Ekosistem" :icon="GlobeAltIcon" :items="ecosystemData" />
            <ButtonPrimary class="mt-auto"> Hitung Campus Health Index</ButtonPrimary>

        </div>
        <div class="w-2/3 flex flex-col gap-4">
            <CampusHealthCardCampusTalentIndex :title="campusTalentData.title" :score="campusTalentData.score"
                :status="campusTalentData.status" :description="campusTalentData.description"
                :icon="campusTalentData.icon" />
            <div class="grid grid-cols-5 gap-4">
                <CampusHealthCardSummaryProgres v-for="(item, index) in summaryData" :key="index" :title="item.title"
                    :score="item.score" :status="item.status" :icon="item.icon" />
            </div>
            <CampusHealthCardFiveDimension :items="profileData" :previous-data="previousData" />

            <CampusHealthTableCalculationHistory :items="calculationHistoryData" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { AcademicCapIcon } from '@heroicons/vue/24/outline'
import { BriefcaseIcon } from '@heroicons/vue/24/outline'
import { ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import { QueueListIcon } from '@heroicons/vue/24/outline'
import { GlobeAltIcon } from '@heroicons/vue/24/outline'
import {
    SparklesIcon,
    Cog6ToothIcon,
} from '@heroicons/vue/24/outline'
import type { InstitutionalRow } from '@/components/CampusHealth/Card/DataInstituional.vue'
const autoData = [
    {
        title: 'CV Lengkap',
        value: '74%'
    },
    {
        title: 'Selesai Asesmen',
        value: '61%'
    },
    {
        title: 'Aktif di Talent Pool',
        value: '38%'
    },
    {
        title: 'Career Readiness',
        value: '68/100'
    },
    {
        title: 'Talent Unggulan',
        value: '11.6%'
    },
    {
        title: 'Alignment Minat',
        value: '77%'
    }
]

const academicData = [
    {
        fullWidth: true,
        label: 'Rata-rata IPK Lulusan',
        value: '3.50',
        suffix: '% Lulusan'
    },
    {
        fields: [
            {
                label: 'Lulus Tepat Waktu',
                value: '72'
            },
            {
                label: 'Rata-rata Masa Studi',
                value: '5'
            }
        ]
    }
]

const employabilityData = [
    {
        label: 'Bekerja <6 Bulan',
        value: '57',
        suffix: '% Lulusan'
    },
    {
        label: 'Sesuai Bidang',
        value: '76',
        suffix: '% Lulusan'
    }
]
const institutionalData: InstitutionalRow[] = [
    {
        fullWidth: true,
        type: 'select',
        label: 'Akreditasi Kampus',
        value: 'A/Baik sekali',
        options: [
            'Unggul',
            'A/Baik sekali',
            'Baik',
            'Cukup'
        ]
    },
    {
        fields: [
            {
                label: 'Prodi Akreditasi A',
                value: '12',
                suffix: 'Jumlah'
            },
            {
                label: 'Rasio Dosen : Mahasiswa',
                value: '30',
                suffix: '1 : (Jumlah Mahasiswa)'
            }
        ]
    }
]

const ecosystemData = [
    {
        label: 'MoU Aktif',
        value: '47'
    },
    {
        label: 'Campus Hiring/Tahun',
        value: '8'
    }
]

const campusTalentData = {
    title: 'Campus Talent Index',
    score: 80,
    status: 'Baik',
    description:
        'Kampus ini berada di posisi yang sangat kuat dalam seluruh dimensi talent. Pertahankan momentum dan fokus pada skalabilitas program.',
    icon: QueueListIcon
}
const summaryData = [
    {
        title: 'Academic Quality',
        score: 69,
        status: 'Developing',
        icon: AcademicCapIcon
    },
    {
        title: 'Employability',
        score: 62,
        status: 'Developing',
        icon: BriefcaseIcon
    },
    {
        title: 'Career Readiness',
        score: 82,
        status: 'Excellent',
        icon: SparklesIcon
    },
    {
        title: 'Talent Potential',
        score: 100,
        status: 'Excellent',
        icon: Cog6ToothIcon
    },
    {
        title: 'Ecosystem Strength',
        score: 52,
        status: 'Needs Attention',
        icon: GlobeAltIcon
    }
]

const profileData = [
    {
        title: 'Academic Quality',
        score: 69,
        description: 'Kualitas akademik sudah cukup baik namun masih ada ruang peningkatan pada ketepatan waktu kelulusan atau rata-rata IPK lulusan.'
    },
    {
        title: 'Employability',
        score: 62,
        description: 'Tingkat penyerapan kerja cukup baik, namun kesesuaian bidang masih bisa ditingkatkan melalui penyelarasan kurikulum dengan industri.'
    },
    {
        title: 'Career Readiness',
        score: 82,
        description: 'Keterlibatan platform cukup baik. Dorong lebih banyak mahasiswa untuk mengaktifkan profil di Talent Pool agar lebih mudah ditemukan perusahaan.'
    },
    {
        title: 'Talent Potential',
        score: 100,
        description: 'Profil potensi mahasiswa sangat menjanjikan—dominasi talent unggulan dan keselarasan minat bakat yang tinggi menjadi nilai jual kuat ke industri.'
    },
    {
        title: 'Ecosystem Strength',
        score: 52,
        description: 'Ekosistem sudah terbentuk dengan baik. Perluas jaringan MoU dan tingkatkan frekuensi campus hiring untuk memperkuat koneksi industri.'
    }
]

const previousData = [
    58,
    54,
    71,
    92,
    60
]

const calculationHistoryData = [
    {
        semester: 'Semester Ganjil',
        year: '2024/2025',
        talentIndex: 61,
        academic: 58,
        employability: 52,
        careerReadiness: 60,
        change: null
    },
    {
        semester: 'Semester Genap',
        year: '2024/2025',
        talentIndex: 100,
        academic: 69,
        employability: 62,
        careerReadiness: 63,
        change: 37
    }
]
</script>