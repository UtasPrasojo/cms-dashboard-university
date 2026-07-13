<template>
    <div class="w-full bg-base-white rounded-2xl p-6 custom-shadow">
        <TbTitle title="Daftar Fakultas" :store="store" placeholder="Cari disini...">
            <ButtonPrimary @click="showAddModal = true">
                Tambah Fakultas
            </ButtonPrimary>
        </TbTitle>

        <TbMain :size="store.filter.size" :data="paginatedFaculties">
            <thead>
                <TbRow type="head">
                    <TbHead>No</TbHead>
                    <TbHead>Fakultas</TbHead>
                    <TbHead>Jumlah Program Studi</TbHead>
                    <TbHead align="center">Aksi</TbHead>
                </TbRow>
            </thead>
            <tbody>
                <TbRow v-for="(faculty, index) in paginatedFaculties" :key="faculty.id">
                    <TbData>{{ (store.filter.page - 1) * store.filter.size + index + 1 }}</TbData>
                    <TbData>{{ faculty.name }}</TbData>
                    <TbData>{{ faculty.major_count }}</TbData>
                    <TbData align="center">
                        <div class="flex items-center justify-center">
                            <TbActionIcon icon="fi fi-rr-eye" title="Lihat Detail" type="netral" />
                        </div>
                    </TbData>
                </TbRow>
            </tbody>
        </TbMain>

        <TbPaginate :filter="paginationFilter" empty_title="Belum ada data fakultas"
            empty_desc="Data fakultas yang ditambahkan akan muncul di sini" />

        <PartialModal v-model="showAddModal" title="Tambah Fakultas">
            <form class="flex flex-col gap-4" @submit.prevent="handleAddFaculty">
                <InputText v-model="newFacultyName" name="faculty_name" label="Fakultas"
                    placeholder="Masukkan nama fakultas" required />
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
    { id: '1', name: 'Ilmu Komputer', major_count: 3 },
    { id: '2', name: 'Ilmu Sosial Politik', major_count: 4 },
    { id: '3', name: 'Ekonomi & Bisnis', major_count: 3 },
    { id: '4', name: 'Ilmu Seni', major_count: 3 },
    { id: '5', name: 'Teknik', major_count: 5 },
    { id: '6', name: 'Keahlian Gizi', major_count: 2 },
    { id: '7', name: 'Psikologi', major_count: 2 },
    { id: '8', name: 'Matematika & Sains', major_count: 2 },
    { id: '9', name: 'Kedokteran', major_count: 5 },
    { id: '10', name: 'Ilmu Sulap', major_count: 2 },
    { id: '11', name: 'Hukum', major_count: 3 },
    { id: '12', name: 'Pertanian', major_count: 4 },
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

const showAddModal = ref(false)
const newFacultyName = ref('')

const handleAddFaculty = () => {
    const name = newFacultyName.value.trim()
    if (!name) return

    dummyFaculties.value.push({
        id: String(dummyFaculties.value.length + 1),
        name,
        major_count: 0,
    })

    newFacultyName.value = ''
    showAddModal.value = false
}
</script>
