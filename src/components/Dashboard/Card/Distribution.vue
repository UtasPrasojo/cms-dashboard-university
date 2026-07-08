<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
    <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
      <h3 class="text-[14px] font-normal text-gray-800">{{ title }}</h3>
      <InformationCircleIcon class="w-5 h-5 text-primary-900" />
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50">
            <th class="text-left font-medium text-[#303030] px-6 py-4 whitespace-nowrap">Program Studi</th>
            <th class="text-left font-medium text-[#303030] px-6 py-4 whitespace-nowrap">Mahasiswa</th>
            <th class="text-left font-medium text-[#303030] px-6 py-4 whitespace-nowrap min-w-[220px]">CV Lengkap</th>
            <th class="text-left font-medium text-[#303030] px-6 py-4 whitespace-nowrap min-w-[220px]">Selesai Asesmen
            </th>
            <th class="text-left font-medium text-[#303030] px-6 py-4 whitespace-nowrap">Career Readiness</th>
            <th class="text-left font-medium text-[#303030] px-6 py-4 whitespace-nowrap">Alignment Minat</th>
            <th class="text-left font-medium text-[#303030] px-6 py-4 whitespace-nowrap">Posisi 9-Box</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(prodi, index) in data" :key="index" class="border-b border-gray-50 last:border-none">
            <td class="px-6 py-4 text-gray-800 font-medium whitespace-nowrap">
              {{ prodi.name }}
            </td>
            <td class="px-6 py-4 text-gray-700 whitespace-nowrap">
              {{ formatNumber(prodi.totalMahasiswa) }}
            </td>

            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <BarProgressBar :value="prodi.cvLengkap" :color="getColor(prodi.cvLengkap)" class="flex-1" />
                <span class="text-gray-800 font-semibold w-10 text-right">
                  {{ prodi.cvLengkap }}%
                </span>
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <BarProgressBar :value="prodi.selesaiAsesmen" :color="getColor(prodi.selesaiAsesmen)" class="flex-1" />
                <span class="text-gray-800 font-semibold w-10 text-right">
                  {{ prodi.selesaiAsesmen }}%
                </span>
              </div>
            </td>

            <td class="px-6 py-4 text-gray-700 whitespace-nowrap">
              {{ prodi.careerReadiness }}
            </td>
            <td class="px-6 py-4 text-gray-700 whitespace-nowrap">
              {{ prodi.alignmentMinat }}%
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                :class="badgeClass(prodi.posisi)">
                <span class="w-1.5 h-1.5 rounded-full" :class="dotClass(prodi.posisi)"></span>
                {{ posisiLabel(prodi.posisi) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import type { PosisiNineBox } from '@/stores/university/type/distribution_student'



export interface ProdiDistribution {
  name: string
  totalMahasiswa: number
  cvLengkap: number
  selesaiAsesmen: number
  careerReadiness: number
  alignmentMinat: number
  posisi: PosisiNineBox
}

interface Props {
  title?: string
  data: ProdiDistribution[]
}

withDefaults(defineProps<Props>(), {
  title: 'Distribusi & Kesiapan per Prodi',
})

const formatNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value)

const getColor = (value: number): 'success' | 'warning' | 'danger' => {
  if (value < 30) return 'danger'
  if (value < 70) return 'warning'
  return 'success'
}

const posisiLabel = (posisi: PosisiNineBox) =>
  posisi.charAt(0).toUpperCase() + posisi.slice(1)

const badgeClass = (posisi: PosisiNineBox) => {
  const map: Record<PosisiNineBox, string> = {
    'prioritas intervensi': 'bg-[#FC8078] text-white',

    'bakat terpendam': 'bg-[#FFB26A] text-white',

    'bintang berkembang': 'bg-[#335ACC] text-white',

    'pekerja keras berprestasi': 'bg-[#705DEF] text-white',

    'talent unggulan': 'bg-[#009E84] text-white',

    'perlu pendampingan': 'bg-[#F9FBFE] text-black',

    'perlu dorongan': 'bg-[#F9FBFE] text-black',

    'profil solid': 'bg-[#F9FBFE] text-black',

    'tekun & konsisten': 'bg-[#F9FBFE] text-black',
  }

  return map[posisi]
}

const dotClass = (posisi: PosisiNineBox) => {
  const lightBadge = [
    'perlu pendampingan',
    'perlu dorongan',
    'profil solid',
    'tekun & konsisten',
  ]

  return lightBadge.includes(posisi)
    ? 'bg-black'
    : 'bg-white'
}
</script>