<template>
    <div class="w-full bg-base-white rounded-2xl p-6 custom-shadow">
        <TbTitle title="Daftar Program Studi" :store="majorStore" placeholder="Cari disini...">
            <ButtonPrimary @click="openCreateModal">
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

        <MasterDataModalDetailMajor v-model="showDetailModal" :major="selectedMajor" @saved="fetchMajors"
            @delete-requested="openDeleteModal" />

        <MasterDataModalDelete v-model="showDeleteModal" title="Hapus Program Studi" entity-label="program studi"
            :name="selectedMajor?.major ?? ''" :confirm-action="handleDeleteMajor" @deleted="fetchMajors" />
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useMajorstore } from '@/stores/university/major.store'
import { useHelperStore } from '@/stores/helper.store'
import { useToastStore } from '@/stores/toast.store'

const majorStore = useMajorstore()
const helperStore = useHelperStore()
const toastStore = useToastStore()

const showDetailModal = ref(false)
const showDeleteModal = ref(false)
const selectedMajor = ref(null)

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

const openCreateModal = () => {
    selectedMajor.value = null
    showDetailModal.value = true
}

const openDetailModal = (item) => {
    selectedMajor.value = item
    showDetailModal.value = true
}

const openDeleteModal = (major) => {
    selectedMajor.value = major
    showDetailModal.value = false
    showDeleteModal.value = true
}

const handleDeleteMajor = async () => {
    if (!selectedMajor.value) return false

    const success = await majorStore.deleteMajor(selectedMajor.value.id, { name: selectedMajor.value.major })

    if (!success) {
        toastStore.display('error', 'Gagal', majorStore.error || 'Gagal menghapus program studi')
        return false
    }

    toastStore.display('success', 'Berhasil', 'Program studi berhasil dihapus')
    return true
}

onMounted(fetchMajors)
watch(fetchParams, fetchMajors)
</script>
