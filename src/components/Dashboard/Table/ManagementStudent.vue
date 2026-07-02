<template>
    <div class="w-full bg-base-white rounded-2xl p-6 custom-shadow">
        <TbTitle title="Daftar Mahasiswa" :store="filterStore" placeholder="Search here...">
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

        <TbMain :size="filter.size" :data="paginatedData">
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
                <TbRow v-for="(student, index) in paginatedData" :key="student.id">
                    <TbData>{{ (filter.page - 1) * filter.size + index + 1 }}</TbData>

                    <TbProfile :name="student.name" :subtitle="student.email" />

                    <TbData>
                        <p class="text-base-black">{{ student.nim }}</p>
                        <p class="text-text-300">{{ student.angkatan }}</p>
                    </TbData>

                    <TbData>{{ student.fakultas }}</TbData>

                    <TbData>{{ student.prodi }}</TbData>

                    <TbData align="center">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                            :class="student.posisi.class">
                            <span class="w-1.5 h-1.5 rounded-full" :class="student.posisi.dot"></span>
                            {{ student.posisi.label }}
                        </span>
                    </TbData>

                    <TbData align="center">
                        <TbActionIcon icon="fi fi-rr-eye" title="Lihat Detail" type="netral" />
                    </TbData>
                </TbRow>
            </tbody>
        </TbMain>

        <TbPaginate :filter="filter" empty_title="Belum ada data mahasiswa"
            empty_desc="Data mahasiswa yang ditambahkan akan muncul di sini" />
    </div>
</template>

<script setup>
import { reactive, computed, watchEffect } from 'vue'

const FIRST_NAMES = [
    'Badrun Sutedjo', 'Kurniawan Santoso', 'Siti Aminah', 'Dewi Lestari', 'Ahmad Fauzi',
    'Rina Wulandari', 'Budi Santoso', 'Putri Ayu Ningsih', 'Rizky Ramadhan', 'Fajar Nugroho',
    'Indah Permatasari', 'Yusuf Maulana', 'Nadia Salsabila', 'Agus Setiawan', 'Wulan Sari',
    'Bayu Aji Pratama', 'Lestari Handayani', 'Dimas Prasetyo', 'Anisa Rahmawati', 'Hendra Gunawan',
]

const FACULTIES = [
    { fakultas: 'Ilmu Komputer', prodi: 'Teknik Informatika' },
    { fakultas: 'Ilmu Komputer', prodi: 'Sistem Informasi' },
    { fakultas: 'Ekonomi dan Bisnis', prodi: 'Manajemen' },
    { fakultas: 'Ekonomi dan Bisnis', prodi: 'Akuntansi' },
    { fakultas: 'Teknik', prodi: 'Teknik Elektro' },
    { fakultas: 'Teknik', prodi: 'Teknik Industri' },
    { fakultas: 'Psikologi', prodi: 'Psikologi' },
    { fakultas: 'Hukum', prodi: 'Ilmu Hukum' },
]

const POSISI_9BOX = [
    { label: 'Baik', class: 'bg-success-500 text-white', dot: 'bg-white' },
    { label: 'Cukup', class: 'bg-warning-500 text-white', dot: 'bg-white' },
    { label: 'Kurang', class: 'bg-error-500 text-white', dot: 'bg-white' },
]

const ANGKATAN_LIST = [2019, 2020, 2021, 2022, 2023]

const students = Array.from({ length: 240 }, (_, i) => {
    const name = FIRST_NAMES[i % FIRST_NAMES.length]
    const { fakultas, prodi } = FACULTIES[i % FACULTIES.length]
    const angkatan = ANGKATAN_LIST[i % ANGKATAN_LIST.length]
    const posisi = i % 11 === 0 ? POSISI_9BOX[2] : i % 7 === 0 ? POSISI_9BOX[1] : POSISI_9BOX[0]

    return {
        id: i + 1,
        name,
        email: `${name.split(' ')[0].toLowerCase()}@student.utfk.id`,
        nim: `${String(angkatan).slice(2)}.B1.${String(i + 1).padStart(5, '0')}`,
        angkatan,
        fakultas,
        prodi,
        posisi,
    }
})

const filter = reactive({
    page: 1,
    size: 10,
    search: '',
    sortBy: null,
    orderBy: null,
    total_page: 0,
    page_index: { first: 0, last: 0, total: 0 },
})

const filterStore = { filter }

const filteredData = computed(() => {
    const query = filter.search.trim().toLowerCase()
    if (!query) return students

    return students.filter(
        (student) =>
            student.name.toLowerCase().includes(query) ||
            student.nim.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query),
    )
})

const paginatedData = computed(() => {
    const start = (filter.page - 1) * filter.size
    return filteredData.value.slice(start, start + filter.size)
})

watchEffect(() => {
    const total = filteredData.value.length
    const totalPage = filter.size > 0 ? Math.ceil(total / filter.size) : 0

    filter.total_page = totalPage

    if (filter.page > totalPage && totalPage > 0) {
        filter.page = totalPage
        return
    }
    if (filter.page < 1) {
        filter.page = 1
        return
    }

    const first = total === 0 ? 0 : (filter.page - 1) * filter.size + 1
    const last = Math.min(filter.page * filter.size, total)
    filter.page_index = { first, last, total }
})
</script>
