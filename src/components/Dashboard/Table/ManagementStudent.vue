<template>
    <div class="w-full bg-base-white rounded-2xl p-6 custom-shadow">
        <TbTitle title="Daftar Mahasiswa" :store="managementStore" placeholder="Search here...">
            <template #center>
                <div class="relative">
                    <button type="button" @click="handleOpenFilter"
                        class="flex items-center gap-2 px-2 py-2 text-xs md:text-sm font-medium border border-border-300 rounded-3xl text-[#6E6E6E] hover:bg-base-section">
                        Filter

                        <div class="flex justify-center items-center w-6 h-6 rounded-full bg-base-dark">
                            <i class="fi fi-rr-settings-sliders text-white text-xs !leading-none mt-0.5"></i>
                        </div>
                    </button>

                    <ManagementStudentModalFilter v-model="showFilterModal" />
                </div>
            </template>

            <ButtonSelectOption label="Tambah Mahasiswa">
                <button type="button" class="select-option-item" @click="handleAddStudent">
                    <span class="select-option-item__icon ">
                        <i class="fi fi-rr-user-add"></i>
                    </span>
                    <span>Tambah Mahasiswa</span>
                </button>

                <button type="button" class="select-option-item" @click="handleImportStudent">
                    <span class="select-option-item__icon">
                        <i class="fi fi-rr-file-import"></i>
                    </span>
                    <span>Import Mahasiswa</span>
                </button>
            </ButtonSelectOption>
        </TbTitle>

        <TbMain :size="managementStore.filter.size" :data="managementStore.students" table-overflow>
            <thead>
                <TbRow type="head">
                    <TbHead>No</TbHead>
                    <TbHead>Mahasiswa</TbHead>
                    <TbHead>NIM &amp; Angkatan</TbHead>
                    <TbHead>Fakultas</TbHead>
                    <TbHead>Program Studi</TbHead>
                    <TbHead align="center">Posisi 9 Box</TbHead>
                    <TbHead>Archetype</TbHead>
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

                    <TbData align="center">
                        <span v-if="getNineBoxMeta(student.ninebox)"
                            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-base-white"
                            :class="getNineBoxMeta(student.ninebox).pill">
                            <span class="w-1.5 h-1.5 rounded-full bg-base-white/80"></span>
                            {{ getNineBoxMeta(student.ninebox).title }}
                        </span>
                        <span v-else class="text-text-300">-</span>
                    </TbData>

                    <TbData>
                        <div v-if="getTopArchetypes(student.archetype).length" class="flex items-center gap-1.5">
                            <div v-for="item in getTopArchetypes(student.archetype)" :key="item.archetype_id"
                                :title="`${item.name} (${item.code}) • ${item.matchPercentage}%`"
                                class="w-6 h-6 shrink-0 rounded-full bg-base-white border-2 border-base-white shadow-sm overflow-hidden flex items-center justify-center">
                                <PartialArchetypeIcon :variant="item.code" :label="item.name" size="medium" class="!w-full !h-full object-cover" />
                            </div>
                        </div>
                        <span v-else class="text-text-300">-</span>
                    </TbData>

                    <TbData align="center">
                        <TbActionIcon icon="fi fi-rr-eye" title="Lihat Detail" type="netral" />
                    </TbData>
                </TbRow>
            </tbody>
        </TbMain>

        <TbPaginate :filter="paginationFilter" empty_title="Belum ada data mahasiswa"
            empty_desc="Data mahasiswa yang ditambahkan akan muncul di sini" />

        <ManagementStudentModalAddStudent v-model="showAddStudentModal" @saved="fetchStudents" />
        <ManagementStudentModalImportStudent v-model="showImportStudentModal" @saved="fetchStudents" />
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useManagementStore } from '@/stores/student/management_student.store'
import { useHelperStore } from '@/stores/helper.store'

const managementStore = useManagementStore()
const helperStore = useHelperStore()

const showAddStudentModal = ref(false)
const showImportStudentModal = ref(false)
const showFilterModal = ref(false)

const handleAddStudent = () => {
    showAddStudentModal.value = true
}

const handleOpenFilter = () => {
    showFilterModal.value = true
}

const handleImportStudent = () => {
    showImportStudentModal.value = true
}


const nineBoxMatrixMeta = [
    [
        { title: 'Potensi Tersembunyi', variant: 'orange' },
        { title: 'Bintang Berkembang', variant: 'blue' },
        { title: 'Talent Unggulan', variant: 'green' },
    ],
    [
        { title: 'Potensi Tersembunyi', variant: 'default' },
        { title: 'Potensi Tersembunyi', variant: 'default' },
        { title: 'Potensi Tersembunyi', variant: 'purple' },
    ],
    [
        { title: 'Prioritas Intervensi', variant: 'red' },
        { title: 'Potensi Tersembunyi', variant: 'default' },
        { title: 'Potensi Tersembunyi', variant: 'default' },
    ],
]

const nineBoxVariantPill = {
    orange: 'bg-orange-400',
    blue: 'bg-blue-600',
    green: 'bg-teal-500',
    purple: 'bg-violet-500',
    red: 'bg-red-500',
    default: 'bg-gray-400',
}

const getNineBoxMeta = (ninebox) => {
    if (!Array.isArray(ninebox) || ninebox.length < 2) return null

    const [row, col] = ninebox
    const meta = nineBoxMatrixMeta[row]?.[col]

    if (!meta) return null

    return { ...meta, pill: nineBoxVariantPill[meta.variant] }
}

const getTopArchetypes = (archetype) => {
    if (!Array.isArray(archetype)) return []

    return [...archetype].sort((a, b) => a.rank - b.rank).slice(0, 3)
}

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
    facultyIds: managementStore.filter.facultyIds,
    majorIds: managementStore.filter.majorIds,
    nineBoxPositions: managementStore.filter.nineBoxPositions,
    archetypes: managementStore.filter.archetypes,
}))

const fetchStudents = async () => {
    helperStore.activate()
    await managementStore.getStudent(fetchParams.value)
    helperStore.deactivate()
}

onMounted(fetchStudents)
watch(fetchParams, fetchStudents)
</script>