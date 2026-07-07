<template>
    <div class="w-full bg-base-white rounded-2xl p-6 custom-shadow">
        <TbTitle title="Daftar Mahasiswa" :store="managementStore" placeholder="Search here...">
            <template #center>
                <button type="button"
                    class="flex items-center gap-2 px-2 py-2 text-xs md:text-sm font-medium border border-border-300 rounded-3xl text-[#6E6E6E] hover:bg-base-section">
                    Filter

                    <div class="flex justify-center items-center w-6 h-6 rounded-full bg-base-dark">
                        <i class="fi fi-rr-settings-sliders text-white text-xs !leading-none mt-0.5"></i>
                    </div>
                </button>
            </template>

            <ButtonPrimary type="button"
                class="px-4 py-2 text-xs md:text-sm font-semibold text-base-white bg-primary-500 rounded-lg hover:bg-primary-600 text-nowrap">
                Import Excel
            </ButtonPrimary>
        </TbTitle>

        <TbMain :size="managementStore.filter.size" :data="managementStore.students">
            <thead>
                <TbRow type="head">
                    <TbHead>No</TbHead>
                    <TbHead>Mahasiswa</TbHead>
                    <TbHead>NIM &amp; Angkatan</TbHead>
                    <TbHead>Fakultas</TbHead>
                    <TbHead>Program Studi</TbHead>
                    <TbHead align="center">Posisi 9 Box</TbHead>
                    <TbHead align="center">Aksi</TbHead>
                </TbRow>
            </thead>
            <tbody>
                <TbRow v-for="(student, index) in managementStore.students" :key="student.id">
                    <TbData>{{ (managementStore.filter.page - 1) * managementStore.filter.size + index + 1 }}</TbData>

                    <TbProfile :name="student.name" :subtitle="student.email" />

                    <TbData>
                        <p class="text-base-black">{{ student.usi }}</p>
                        <p class="text-text-300">{{ student.cohort }}</p>
                    </TbData>

                    <TbData>{{ student.faculty }}</TbData>

                    <TbData>{{ student.major }}</TbData>

                    <TbData align="center">-</TbData>

                    <TbData align="center">
                        <TbActionIcon icon="fi fi-rr-eye" title="Lihat Detail" type="netral" />
                    </TbData>
                </TbRow>
            </tbody>
        </TbMain>

        <TbPaginate :filter="paginationFilter" empty_title="Belum ada data mahasiswa"
            empty_desc="Data mahasiswa yang ditambahkan akan muncul di sini" />
    </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useManagementStore } from '@/stores/student/management_student.store'
import { useHelperStore } from '@/stores/helper.store'

const managementStore = useManagementStore()
const helperStore = useHelperStore()

const paginationFilter = computed(() => ({
    get page() { return managementStore.filter.page },
    set page(value) { managementStore.filter.page = value },
    get size() { return managementStore.filter.size },
    set size(value) { managementStore.filter.size = value },
    total_page: managementStore.totalPage,
    page_index: managementStore.pageIndex,
}))

const fetchParams = computed(() => ({
    page: managementStore.filter.page,
    size: managementStore.filter.size,
    search: managementStore.filter.search,
    sortBy: managementStore.filter.sortBy,
    orderBy: managementStore.filter.orderBy,
}))

const fetchStudents = async () => {
    helperStore.activate()
    await managementStore.getStudent(fetchParams.value)
    helperStore.deactivate()
}

onMounted(fetchStudents)
watch(fetchParams, fetchStudents)
</script>
