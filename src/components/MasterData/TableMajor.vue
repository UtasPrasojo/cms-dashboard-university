<template>
    <div class="w-full bg-base-white rounded-2xl p-6 custom-shadow">
        <TbTitle title="Daftar Program Studi" :store="store" placeholder="Cari disini...">
            <ButtonPrimary @click="showAddModal = true">
                Tambah Program Studi
            </ButtonPrimary>
        </TbTitle>

        <TbMain :size="store.filter.size" :data="paginatedFaculties">
            <thead>
                <TbRow type="head">
                    <TbHead>No</TbHead>
                    <TbHead>Program Studi</TbHead>
                    <TbHead>Fakultas</TbHead>
                    <TbHead align="center">Aksi</TbHead>
                </TbRow>
            </thead>
            <tbody>
                <TbRow v-for="(faculty, index) in paginatedFaculties" :key="faculty.id">
                    <TbData>{{ (store.filter.page - 1) * store.filter.size + index + 1 }}</TbData>
                    <TbData>{{ faculty.name }}</TbData>
                    <TbData>{{ faculty.faculty }}</TbData>
                    <TbData align="center">
                        <TbActionIcon icon="fi fi-rr-eye" title="Lihat Detail" type="netral" />
                    </TbData>
                </TbRow>
            </tbody>
        </TbMain>

        <TbPaginate :filter="paginationFilter" empty_title="Belum ada data proram studi"
            empty_desc="Data program studi yang ditambahkan akan muncul di sini" />

        <PartialModal v-model="showAddModal" title="Tambah Program Studi" >
            <form class="flex flex-col gap-4" @submit.prevent="handleAddFaculty">
                <InputText v-model="newFacultyName" name="majpr_name" label="Program Studi"
                    placeholder="Masukkan nama program studi" required />
                <ButtonSelectOutlineGrey v-model="newFacultyId" :options="facultyOptions" />
                <ButtonPrimary type="submit" class="w-full">
                    Tambah Fakultas
                </ButtonPrimary>
            </form>
        </PartialModal>
    </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'

const dummyFaculties = ref([
    { id: '1', name: 'Ilmu Komputer', faculty: 'Fakultas Teknik' },
    { id: '2', name: 'Ilmu Sosial Politik', faculty: 'Fakultas Teknik' },
    { id: '3', name: 'Ekonomi & Bisnis', faculty: 'Fakultas Teknik' },
    { id: '4', name: 'Ilmu Seni', faculty: 'Fakultas Teknik' },
    { id: '5', name: 'Teknik', faculty: 'Fakultas Teknik' },
    { id: '6', name: 'Keahlian Gizi', faculty: 'Fakultas Teknik' },
    { id: '7', name: 'Psikologi', faculty: 'Fakultas Teknik' },
    { id: '8', name: 'Matematika & Sains', faculty: 'Fakultas Teknik' },
    { id: '9', name: 'Kedokteran', faculty: 'Fakultas Teknik' },
    { id: '10', name: 'Ilmu Sulap', faculty: 'Fakultas Teknik' },
    { id: '11', name: 'Hukum', faculty: 'Fakultas Teknik' },
    { id: '12', name: 'Pertanian', faculty: 'Fakultas Teknik' },
])

const store = reactive({
    filter: {
        page: 1,
        size: 10,
        search: '',
        sortBy: '',
        orderBy: '',
    },
})

const filteredFaculties = computed(() =>
    dummyFaculties.value.filter((faculty) =>
        faculty.name.toLowerCase().includes(store.filter.search.toLowerCase())
    )
)

const totalPage = computed(() =>
    store.filter.size > 0 ? Math.ceil(filteredFaculties.value.length / store.filter.size) : 0
)

const pageIndex = computed(() => {
    const { page, size } = store.filter
    const total = filteredFaculties.value.length
    return {
        first: total === 0 ? 0 : (page - 1) * size + 1,
        last: Math.min(page * size, total),
        total,
    }
})

const paginatedFaculties = computed(() => {
    const start = (store.filter.page - 1) * store.filter.size
    return filteredFaculties.value.slice(start, start + store.filter.size)
})

const paginationFilter = computed(() => ({
    get page() { return store.filter.page },
    set page(value) { store.filter.page = value },
    get size() { return store.filter.size },
    set size(value) { store.filter.size = value },
    total_page: totalPage.value,
    page_index: pageIndex.value,
}))

const facultyOptions = ref([
    { value: '1', label: 'Fakultas Teknik' },
    { value: '2', label: 'Fakultas Ekonomi & Bisnis' },
    { value: '3', label: 'Fakultas Ilmu Sosial dan Politik' },
    { value: '4', label: 'Fakultas Kedokteran' },
    { value: '5', label: 'Fakultas Hukum' },
    { value: '6', label: 'Fakultas Pertanian' },
])

const showAddModal = ref(false)
const newFacultyName = ref('')
const newFacultyId = ref(null)

const handleAddFaculty = () => {
    const name = newFacultyName.value.trim()
    if (!name) return

    const selectedFaculty = facultyOptions.value.find((option) => option.value === newFacultyId.value)

    dummyFaculties.value.push({
        id: String(dummyFaculties.value.length + 1),
        name,
        faculty: selectedFaculty ? selectedFaculty.label : '',
    })

    newFacultyName.value = ''
    newFacultyId.value = null
    showAddModal.value = false
}
</script>
