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
          <TbHead>Fakultas</TbHead>
          <TbHead>Jumlah Mahasiswa</TbHead>
          <TbHead>CV Lengkap</TbHead>
          <TbHead>Selesai Asesmen</TbHead>
          <TbHead>Career Readiness</TbHead>
     
        </TbRow>
      </thead>
      <tbody>
        <TbRow v-for="(prodi, index) in data" :key="index">
          <TbData>
            <span class="font-medium text-gray-800">{{ prodi.name }}</span>
          </TbData>
            <TbData>
            <span class="font-medium text-gray-800">{{ prodi.faculty }}</span>
          </TbData>

          <TbData class="text-center">{{ formatNumber(prodi.totalMahasiswa) }}</TbData>

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

          <TbData class="text-center">{{ prodi.careerReadiness }}</TbData>
    

          
        </TbRow>
      </tbody>
    </TbMain>

    <TbPaginate :filter="paginationFilter" empty_title="Belum ada data distribusi"
      empty_desc="Data distribusi prodi akan muncul di sini" />
  </div>
</template>

<script setup lang="ts">
import { InformationCircleIcon } from '@heroicons/vue/24/outline'

export interface ProdiDistribution {
  name: string
  faculty: string
  totalMahasiswa: number
  cvLengkap: number
  selesaiAsesmen: number
  careerReadiness: number
  alignmentMinat: number
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




</script>