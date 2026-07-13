<template>
    <div class="w-full bg-base-white rounded-2xl p-6 custom-shadow">
        <TbTitle title="Daftar Program Studi" :store="majorStore" placeholder="Cari disini...">
            <ButtonPrimary @click="showAddModal = true">
                Tambah Program Studi
            </ButtonPrimary>
        </TbTitle>

        <TbMain :size="majorStore.filter.size" :data="majorStore.majors">
            <thead>
                <TbRow type="head">
                    <TbHead>No</TbHead>
                    <TbHead>Program Studi</TbHead>
                    <TbHead>Jenjang Pendidikan</TbHead>
                    <TbHead>Fakultas</TbHead>
                    <TbHead align="center">Aksi</TbHead>
                </TbRow>
            </thead>
            <tbody>
                <TbRow v-for="(item, index) in majorStore.majors" :key="item.id">
                    <TbData>{{ (majorStore.filter.page - 1) * majorStore.filter.size + index + 1 }}</TbData>
                    <TbData>{{ item.major }}</TbData>
                    <TbData>{{ item.education_level }}</TbData>
                    <TbData>{{ item.faculty }}</TbData>
                    <TbData align="center">
                        <div class="flex items-center justify-center">
                            <TbActionIcon icon="fi fi-rr-eye" title="Lihat Detail" type="netral"
                                @click="openDetailModal(item)" />
                        </div>
                    </TbData>
                </TbRow>
            </tbody>
        </TbMain>

        <TbPaginate :filter="paginationFilter" empty_title="Belum ada data proram studi"
            empty_desc="Data program studi yang ditambahkan akan muncul di sini" />

        <PartialModal v-model="showAddModal" title="Tambah Program Studi">
            <form class="flex flex-col gap-4" @submit.prevent="handleAddFaculty">
                <InputText v-model="newFacultyName" name="major_name" label="Program Studi"
                    placeholder="Masukkan nama program studi" required />
                <ButtonSelectOutlineGrey v-model="newEducationLevel" :options="educationLevelOptions"
                    label="Jenjang Pendidikan" placeholder="Pilih jenjang pendidikan" required />
                <ButtonSelectOutlineGrey v-model="newFacultyId" :options="facultyOptions" label="Fakultas"
                    placeholder="Pilih fakultas" required />

                <ButtonPrimary type="submit" class="w-full">
                    Tambah Fakultas
                </ButtonPrimary>
            </form>
        </PartialModal>

        <PartialModal v-model="showDetailModal" title="Detail Program Studi" @close="resetDetailModal">
            <form class="flex flex-col gap-4" @submit.prevent="handleUpdateMajor">
                <InputText v-model="editMajorName" name="edit_major_name" label="Program Studi"
                    placeholder="Masukkan nama program studi" required />
                <ButtonSelectOutlineGrey v-model="editEducationLevel" :options="educationLevelOptions"
                    label="Jenjang Pendidikan" placeholder="Pilih jenjang pendidikan" required />
                <ButtonSelectOutlineGrey v-model="editFacultyId" :options="facultyOptions" label="Fakultas"
                    placeholder="Pilih fakultas" required />

                <ButtonPrimary type="submit" class="w-full">
                    Simpan Perubahan
                </ButtonPrimary>
            </form>

            <button type="button" class="mt-3 w-full text-center text-sm font-medium text-error-500 hover:underline"
                @click="openDeleteModal">
                Hapus Program Studi
            </button>
        </PartialModal>

        <PartialModal v-model="showDeleteModal" title="Hapus Program Studi" centered max-width="420px"
            @close="resetDeleteModal">
            <div class="flex flex-col gap-4">
                <p class="text-sm text-text-400">
                    Apakah Anda yakin ingin menghapus program studi
                    "<strong class="text-base-black">{{ selectedMajor?.major }}</strong>". Aksi ini tidak dapat
                    dibatalkan dan program studi akan terhapus secara permanen.
                </p>
                <InputText v-model="deleteConfirmName" name="delete_major_name"
                    placeholder="Masukkan nama program studi" />
            </div>

            <template #footer>
                <div class="grid grid-cols-2 gap-3 w-full">
                    <ButtonPrimaryOutline @click="showDeleteModal = false">
                        Batal
                    </ButtonPrimaryOutline>
                    <ButtonDanger :disabled="!isDeleteConfirmed" @click="handleDeleteMajor">
                        Hapus
                    </ButtonDanger>
                </div>
            </template>
        </PartialModal>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useMajorstore } from '@/stores/university/major.store'
import { useFacultystore } from '@/stores/university/faculty.store'
import { useHelperStore } from '@/stores/helper.store'
import { useToastStore } from '@/stores/toast.store'

const majorStore = useMajorstore()
const facultyStore = useFacultystore()
const helperStore = useHelperStore()
const toastStore = useToastStore()

const fetchParams = computed(() => ({
    page: majorStore.filter.page,
    size: majorStore.filter.size,
    search: majorStore.filter.search,
    sortBy: majorStore.filter.sortBy,
    orderBy: majorStore.filter.orderBy,
}))

const fetchMajors = async () => {
    helperStore.activate()
    await majorStore.getMajors(fetchParams.value)
    helperStore.deactivate()

    if (majorStore.error) {
        toastStore.display('error', 'Gagal', majorStore.error)
    }
}

const paginationFilter = computed(() => ({
    get page() { return majorStore.filter.page },
    set page(value) { majorStore.filter.page = value },
    get size() { return majorStore.filter.size },
    set size(value) { majorStore.filter.size = value },
    total_page: majorStore.totalPage,
    page_index: majorStore.pageIndex,
}))

onMounted(() => {
    fetchMajors()
    facultyStore.getAllFaculties()
})
watch(fetchParams, fetchMajors)

const facultyOptions = computed(() =>
    facultyStore.allFaculties.map((faculty) => ({
        value: faculty.id,
        label: faculty.name,
    }))
)

const educationLevelOptions = [
    { value: 'S3 / Doktor', label: 'S3 / Doktor' },
    { value: 'S2 / Magister', label: 'S2 / Magister' },
    { value: 'S1 / Sarjana', label: 'S1 / Sarjana' },
    { value: 'D4 / Sarjana Terapan', label: 'D4 / Sarjana Terapan' },
    { value: 'D3', label: 'D3' },
    { value: 'D2', label: 'D2' },
    { value: 'D1', label: 'D1' },
]

const showAddModal = ref(false)
const newFacultyName = ref('')
const newFacultyId = ref(null)
const newEducationLevel = ref(null)

const resetAddForm = () => {
    newFacultyName.value = ''
    newFacultyId.value = null
    newEducationLevel.value = null
}

const handleAddFaculty = async () => {
    const name = newFacultyName.value.trim()
    if (!name || !newFacultyId.value || !newEducationLevel.value) return

    const success = await majorStore.createMajor({
        name,
        faculty_id: newFacultyId.value,
        education_level: newEducationLevel.value,
    })

    if (!success) {
        toastStore.display('error', 'Gagal', majorStore.error || 'Gagal menambahkan program studi')
        return
    }

    toastStore.display('success', 'Berhasil', 'Program studi berhasil ditambahkan')
    resetAddForm()
    showAddModal.value = false
    await fetchMajors()
}

const showDetailModal = ref(false)
const selectedMajor = ref(null)
const editMajorName = ref('')
const editEducationLevel = ref(null)
const editFacultyId = ref(null)
const showDeleteModal = ref(false)
const deleteConfirmName = ref('')

const findFacultyIdByName = (name) =>
    facultyStore.allFaculties.find((faculty) => faculty.name === name)?.id ?? null

const openDetailModal = (item) => {
    selectedMajor.value = item
    editMajorName.value = item.major
    editEducationLevel.value = item.education_level
    editFacultyId.value = findFacultyIdByName(item.faculty)
    showDetailModal.value = true
}

const resetDetailModal = () => {
    selectedMajor.value = null
    editMajorName.value = ''
    editEducationLevel.value = null
    editFacultyId.value = null
}

const handleUpdateMajor = async () => {
    const name = editMajorName.value.trim()
    if (!name || !editFacultyId.value || !editEducationLevel.value || !selectedMajor.value) return

    const success = await majorStore.updateMajor(selectedMajor.value.id, {
        name,
        faculty_id: editFacultyId.value,
        education_level: editEducationLevel.value,
    })

    if (!success) {
        toastStore.display('error', 'Gagal', majorStore.error || 'Gagal memperbarui program studi')
        return
    }

    toastStore.display('success', 'Berhasil', 'Program studi berhasil diperbarui')
    showDetailModal.value = false
    resetDetailModal()
    await fetchMajors()
}

const isDeleteConfirmed = computed(() =>
    !!selectedMajor.value && deleteConfirmName.value.trim() === selectedMajor.value.major
)

const openDeleteModal = () => {
    showDetailModal.value = false
    showDeleteModal.value = true
}

const resetDeleteModal = () => {
    deleteConfirmName.value = ''
}

const handleDeleteMajor = async () => {
    if (!isDeleteConfirmed.value || !selectedMajor.value) return

    const success = await majorStore.deleteMajor(selectedMajor.value.id, { name: deleteConfirmName.value.trim() })

    if (!success) {
        toastStore.display('error', 'Gagal', majorStore.error || 'Gagal menghapus program studi')
        return
    }

    toastStore.display('success', 'Berhasil', 'Program studi berhasil dihapus')
    showDeleteModal.value = false
    resetDeleteModal()
    selectedMajor.value = null
    await fetchMajors()
}
</script>
