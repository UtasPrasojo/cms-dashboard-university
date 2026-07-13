<template>
    <div class="w-full bg-base-white rounded-2xl p-6 custom-shadow">
        <TbTitle title="Daftar Fakultas" :store="facultyStore" placeholder="Cari disini...">
            <ButtonPrimary @click="showAddModal = true">
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

        <PartialModal v-model="showAddModal" title="Tambah Fakultas">
            <form class="flex flex-col gap-4" @submit.prevent="handleAddFaculty">
                <InputText v-model="newFacultyName" name="faculty_name" label="Fakultas"
                    placeholder="Masukkan nama fakultas" required />
                <ButtonPrimary type="submit" class="w-full">
                    Tambah Fakultas
                </ButtonPrimary>
            </form>
        </PartialModal>

        <PartialModal v-model="showDetailModal" title="Detail Fakultas" @close="resetDetailModal">
            <form class="flex flex-col gap-4" @submit.prevent="handleUpdateFaculty">
                <InputText v-model="editFacultyName" name="edit_faculty_name" label="Fakultas"
                    placeholder="Masukkan nama fakultas" required />

                <div class="rounded-xl bg-base-section p-4" v-if="selectedFaculty">
                    <p class="text-sm font-semibold text-base-black mb-2">Program Studi</p>
                    <p v-if="facultyDetailLoading" class="text-sm text-text-400">Memuat...</p>
                    <ul v-else-if="facultyMajors.length" class="list-disc list-inside text-sm text-text-400 space-y-1">
                        <li v-for="major in facultyMajors" :key="major.id">{{ major.name }}</li>
                    </ul>
                    <p v-else class="text-sm text-text-400">Belum ada program studi</p>
                </div>

                <ButtonPrimary type="submit" class="w-full">
                    Simpan Perubahan
                </ButtonPrimary>
            </form>

            <button type="button" class="mt-3 w-full text-center text-sm font-medium text-error-500 hover:underline"
                @click="openDeleteModal">
                Hapus Fakultas
            </button>
        </PartialModal>

        <PartialModal v-model="showDeleteModal" title="Hapus Fakultas" centered max-width="420px"
            @close="resetDeleteModal">
            <div class="flex flex-col gap-4">
                <p class="text-sm text-text-400">
                    Apakah Anda yakin ingin menghapus fakultas
                    “<strong class="text-base-black">{{ selectedFaculty?.name }}</strong>”. Aksi ini tidak dapat
                    dibatalkan dan fakultas akan terhapus secara permanen.
                </p>
                <InputText v-model="deleteConfirmName" name="delete_faculty_name"
                    placeholder="Masukkan nama fakultas" />
            </div>

            <template #footer>
                <div class="grid grid-cols-2 gap-3 w-full">
                    <ButtonPrimaryOutline @click="showDeleteModal = false">
                        Batal
                    </ButtonPrimaryOutline>
                    <ButtonDanger :disabled="!isDeleteConfirmed" @click="handleDeleteFaculty">
                        Hapus
                    </ButtonDanger>
                </div>
            </template>
        </PartialModal>
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
const selectedFaculty = ref(null)
const editFacultyName = ref('')
const facultyMajors = ref([])
const facultyDetailLoading = ref(false)
const showDeleteModal = ref(false)
const deleteConfirmName = ref('')

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

const showAddModal = ref(false)
const newFacultyName = ref('')

const handleAddFaculty = async () => {
    const name = newFacultyName.value.trim()
    if (!name) return

    const success = await facultyStore.createFaculty({ name })

    if (!success) {
        toastStore.display('error', 'Gagal', facultyStore.error || 'Gagal menambahkan fakultas')
        return
    }

    toastStore.display('success', 'Berhasil', 'Fakultas berhasil ditambahkan')
    newFacultyName.value = ''
    showAddModal.value = false
    await fetchFaculties()
}

const openDetailModal = async (faculty) => {
    selectedFaculty.value = faculty
    editFacultyName.value = faculty.name
    facultyMajors.value = []
    showDetailModal.value = true

    facultyDetailLoading.value = true
    const detail = await facultyStore.getFacultyById(faculty.id)
    facultyDetailLoading.value = false

    if (detail) {
        facultyMajors.value = detail.majors
    }
}

const resetDetailModal = () => {
    selectedFaculty.value = null
    editFacultyName.value = ''
    facultyMajors.value = []
}

const handleUpdateFaculty = async () => {
    const name = editFacultyName.value.trim()
    if (!name || !selectedFaculty.value) return

    const success = await facultyStore.updateFaculty(selectedFaculty.value.id, { name })

    if (!success) {
        toastStore.display('error', 'Gagal', facultyStore.error || 'Gagal memperbarui fakultas')
        return
    }

    toastStore.display('success', 'Berhasil', 'Fakultas berhasil diperbarui')
    showDetailModal.value = false
    resetDetailModal()
    await fetchFaculties()
}



const isDeleteConfirmed = computed(() =>
    !!selectedFaculty.value && deleteConfirmName.value.trim() === selectedFaculty.value.name
)

const openDeleteModal = () => {
    showDetailModal.value = false
    showDeleteModal.value = true
}

const resetDeleteModal = () => {
    deleteConfirmName.value = ''
}

const handleDeleteFaculty = async () => {
    if (!isDeleteConfirmed.value || !selectedFaculty.value) return

    const success = await facultyStore.deleteFaculty(selectedFaculty.value.id, { name: deleteConfirmName.value.trim() })

    if (!success) {
        toastStore.display('error', 'Gagal', facultyStore.error || 'Gagal menghapus fakultas')
        return
    }

    toastStore.display('success', 'Berhasil', 'Fakultas berhasil dihapus')
    showDeleteModal.value = false
    resetDeleteModal()
    selectedFaculty.value = null
    await fetchFaculties()
}

onMounted(fetchFaculties)
watch(fetchParams, fetchFaculties)
</script>
