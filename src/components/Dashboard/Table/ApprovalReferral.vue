<template>
    <div class="w-full bg-base-white rounded-2xl p-6 custom-shadow">
        <TbTitle title="Approval Referral" :store="approvalStore" placeholder="Cari disini...">
            <template #center>
                <button type="button"
                    class="flex items-center gap-2 px-2 py-2 text-xs md:text-sm font-medium border border-border-300 rounded-3xl text-[#6E6E6E] hover:bg-base-section">
                    Filter

                    <div class="flex justify-center items-center w-6 h-6 rounded-full bg-base-dark">
                        <i class="fi fi-rr-settings-sliders text-white text-xs !leading-none mt-0.5"></i>
                    </div>
                </button>
            </template>
        </TbTitle>

        <TbMain :size="approvalStore.filter.size" :data="approvalStore.approvals" table-overflow>
            <thead>
                <TbRow type="head">
                    <TbHead>No</TbHead>
                    <TbHead>Nama Mahasiswa Pemohon</TbHead>
                    <TbHead>Email</TbHead>
                    <TbHead>NIM</TbHead>
                    <TbHead>Fakultas</TbHead>
                    <TbHead>Program Studi</TbHead>
                    <TbHead align="center">Aksi</TbHead>
                </TbRow>
            </thead>
            <tbody>
                <TbRow v-for="(item, index) in approvalStore.approvals" :key="item.id">
                    <TbData>{{ (approvalStore.filter.page - 1) * approvalStore.filter.size + index + 1 }}</TbData>

                    <TbData>{{ item.name }}</TbData>

                    <TbData>{{ item.email }}</TbData>

                    <TbData>{{ item.usi }}</TbData>

                    <TbData>{{ item.faculty }}</TbData>

                    <TbData>
                        <p class="text-base-black">{{ item.major }}</p>
                        <p class="text-text-300">{{ item.education_level }}</p>
                    </TbData>

                    <TbData align="center">
                        <div class="flex items-center justify-center">
                            <TbActionIcon icon="fi fi-rr-eye" title="Lihat Detail" type="netral"
                                @click="openApprovalModal(item)" />
                        </div>
                    </TbData>
                </TbRow>
            </tbody>
        </TbMain>

        <TbPaginate :filter="paginationFilter" empty_title="Belum ada pengajuan referral"
            empty_desc="Pengajuan referral mahasiswa akan muncul di sini" />

        <ManagementStudentModalApproval v-model="showApprovalModal" :student="selectedReferral" />
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useApprovalStore } from '@/stores/student/approval.store'
import { useHelperStore } from '@/stores/helper.store'

const approvalStore = useApprovalStore()
const helperStore = useHelperStore()

const showApprovalModal = ref(false)
const selectedReferral = ref(null)

const openApprovalModal = (item) => {
    selectedReferral.value = item
    showApprovalModal.value = true
}

const paginationFilter = computed(() => ({
    get page() { return approvalStore.filter.page },
    set page(value) { approvalStore.filter.page = value },
    get size() { return approvalStore.filter.size },
    set size(value) { approvalStore.filter.size = value },
    total_page: approvalStore.totalPage,
    page_index: approvalStore.pageIndex,
}))

const fetchParams = computed(() => ({
    page: approvalStore.filter.page,
    size: approvalStore.filter.size,
    search: approvalStore.filter.search,
    sortBy: approvalStore.filter.sortBy,
    orderBy: approvalStore.filter.orderBy,
}))

const fetchApprovals = async () => {
    helperStore.activate()
    await approvalStore.getApprovals(fetchParams.value)
    helperStore.deactivate()
}

onMounted(fetchApprovals)
watch(fetchParams, fetchApprovals)
</script>
