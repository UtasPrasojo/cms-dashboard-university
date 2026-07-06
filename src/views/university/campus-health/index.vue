<template>
    <div class="w-full p-4 justify-between">
        <p class="text-[21px] font-medium ">Campus Health Index</p>
    </div>
    <div class="flex flex-row gap-4 px-4">
        <div class="w-1/3 bg-blue-500">
            <CampusHealthCardDataAutomated title="Data Otomatis Dari Jenjang" :items="autoData" />
            <CampusHealthCardDataAcademic title="Data Akademik" :icon="AcademicCapIcon" :items="academicData" />
            <CampusHealthCardDataEmployability title="Data Employability" :icon="BriefcaseIcon"
                :items="employabilityData" />
            <CampusHealthCardDataInstituional title="Data Institusional" :icon="ClipboardDocumentCheckIcon"
                :items="institutionalData" />
            <CampusHealthCardDataEcosystem title="Data Ekosistem" :icon="GlobeAltIcon" :items="ecosystemData" />

        </div>
        <div class="w-2/3 bg-red-800">hehahahha</div>
    </div>
</template>
<script setup lang="ts">
import { AcademicCapIcon } from '@heroicons/vue/24/outline'
import { BriefcaseIcon } from '@heroicons/vue/24/outline'
import { ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import { GlobeAltIcon } from '@heroicons/vue/24/outline'
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
</script>