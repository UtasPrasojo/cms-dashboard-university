<template>
    <div class="w-full bg-base-white rounded-2xl p-6 custom-shadow">
        <TbTitle title="Daftar Fakultas" :store="facultyStore" placeholder="Cari disini...">
            <ButtonPrimary @click="openCreateModal">
                Tambah Fakultas
            </ButtonPrimary>
        </TbTitle>

        <TbMain :size="facultyStore.filter.size" :data="facultyStore.faculties">
            <thead>
                <TbRow type="head">
                    <TbHead>No</TbHead>
                    <TbHead>Fakultas</TbHead>
                    <TbHead>Jumlah Program Studi</TbHead>
                    <TbHead align="center">Aksi</TbHead>
                </TbRow>
            </thead>
            <tbody>
                <TbRow v-for="(faculty, index) in facultyStore.faculties" :key="faculty.id">
                    <TbData>{{ (facultyStore.filter.page - 1) * facultyStore.filter.size + index + 1 }}</TbData>
                    <TbData>{{ faculty.name }}</TbData>
                    <TbData>{{ faculty.major_count }}</TbData>
                    <TbData align="center">
                        <div class="flex items-center justify-center">
                            <TbActionIcon icon="fi fi-rr-eye" title="Lihat Detail" type="netral"
                                @click="openDetailModal(faculty)" />
                        </div>
                    </TbData>
                </TbRow>
            </tbody>
        </TbMain>

        <TbPaginate :filter="paginationFilter" empty_title="Belum ada data fakultas"
            empty_desc="Data fakultas yang ditambahkan akan muncul di sini" />

        <MasterDataModalDetailFaculty v-model="showDetailModal" :faculty="selectedFaculty" @saved="fetchFaculties"
            @delete-requested="openDeleteModal" />

        <MasterDataModalDelete v-model="showDeleteModal" title="Hapus Fakultas" entity-label="fakultas"
            :name="selectedFaculty?.name ?? ''" :confirm-action="handleDeleteFaculty" @deleted="fetchFaculties" />
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useFacultystore } from '@/stores/university/faculty.store'
import { useHelperStore } from '@/stores/helper.store'
import { useToastStore } from '@/stores/toast.store'

const facultyStore = useFacultystore()
const helperStore = useHelperStore()
const toastStore = useToastStore()

const showDetailModal = ref(false)
const showDeleteModal = ref(false)
const selectedFaculty = ref(null)

const fetchParams = computed(() => ({
    page: facultyStore.filter.page,
    size: facultyStore.filter.size,
    search: facultyStore.filter.search,
    sortBy: facultyStore.filter.sortBy,
    orderBy: facultyStore.filter.orderBy,
}))

const fetchFaculties = async () => {
    helperStore.activate()
    await facultyStore.getFaculty(fetchParams.value)
    helperStore.deactivate()
}

const paginationFilter = computed(() => ({
    get page() { return facultyStore.filter.page },
    set page(value) { facultyStore.filter.page = value },
    get size() { return facultyStore.filter.size },
    set size(value) { facultyStore.filter.size = value },
    total_page: facultyStore.totalPage,
    page_index: facultyStore.pageIndex,
}))

const openCreateModal = () => {
    selectedFaculty.value = null
    showDetailModal.value = true
}

const openDetailModal = (faculty) => {
    selectedFaculty.value = faculty
    showDetailModal.value = true
}

const openDeleteModal = (faculty) => {
    selectedFaculty.value = faculty
    showDetailModal.value = false
    showDeleteModal.value = true
}

const handleDeleteFaculty = async () => {
    if (!selectedFaculty.value) return false

    const success = await facultyStore.deleteFaculty(selectedFaculty.value.id, { name: selectedFaculty.value.name })

    if (!success) {
        toastStore.display('error', 'Gagal', facultyStore.error || 'Gagal menghapus fakultas')
        return false
    }

    toastStore.display('success', 'Berhasil', 'Fakultas berhasil dihapus')
    return true
}

onMounted(fetchFaculties)
watch(fetchParams, fetchFaculties)
</script>
