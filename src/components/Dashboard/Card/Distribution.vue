<template>
  <div class="w-full bg-base-white rounded-2xl p-6 custom-shadow">
    <div class="flex items-center justify-between pb-5 border-b border-gray-100">
      <h3 class="text-[14px] font-normal text-gray-800">{{ title }}</h3>
      <InformationCircleIcon class="w-5 h-5 text-primary-900" />
    </div>

    <TbMain :size="paginationFilter.size" :data="data">
      <thead>
        <TbRow type="head">
          <TbHead>Program Studi</TbHead>
          <TbHead>Mahasiswa</TbHead>
          <TbHead>CV Lengkap</TbHead>
          <TbHead>Selesai Asesmen</TbHead>
          <TbHead>Career Readiness</TbHead>
          <TbHead>Alignment Minat</TbHead>
          <TbHead align="center">Posisi 9-Box</TbHead>
        </TbRow>
      </thead>
      <tbody>
        <TbRow v-for="(prodi, index) in data" :key="index">
          <TbData>
            <span class="font-medium text-gray-800">{{ prodi.name }}</span>
          </TbData>

          <TbData>{{ formatNumber(prodi.totalMahasiswa) }}</TbData>

          <TbData>
            <div class="flex items-center gap-3 min-w-[220px]">
              <BarProgressBar :value="prodi.cvLengkap" :color="getColor(prodi.cvLengkap)" class="flex-1" />
              <span class="text-gray-800 font-semibold w-10 text-right">
                {{ prodi.cvLengkap }}%
              </span>
            </div>
          </TbData>

          <TbData>
            <div class="flex items-center gap-3 min-w-[220px]">
              <BarProgressBar :value="prodi.selesaiAsesmen" :color="getColor(prodi.selesaiAsesmen)" class="flex-1" />
              <span class="text-gray-800 font-semibold w-10 text-right">
                {{ prodi.selesaiAsesmen }}%
              </span>
            </div>
          </TbData>

          <TbData>{{ prodi.careerReadiness }}</TbData>
          <TbData>{{ prodi.alignmentMinat }}%</TbData>

          <TbData align="center">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              :class="badgeClass(prodi.posisi)">
              <span class="w-1.5 h-1.5 rounded-full" :class="dotClass(prodi.posisi)"></span>
              {{ posisiLabel(prodi.posisi) }}
            </span>
          </TbData>
        </TbRow>
      </tbody>
    </TbMain>

    <TbPaginate :filter="paginationFilter" empty_title="Belum ada data distribusi"
      empty_desc="Data distribusi prodi akan muncul di sini" />
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

interface PaginationFilter {
  page: number
  size: number
  total_page: number
  page_index: number
}

interface Props {
  title?: string
  data: ProdiDistribution[]
  paginationFilter: PaginationFilter
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