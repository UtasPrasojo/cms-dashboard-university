<template>
    <div class="w-full bg-base-white rounded-2xl p-6 custom-shadow">
        <TbTitle title="Approval Referral" :store="store" placeholder="Cari disini...">
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

        <TbMain :size="filter.size" :data="paginatedReferrals">
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
                <TbRow v-for="(item, index) in paginatedReferrals" :key="item.id">
                    <TbData>{{ (filter.page - 1) * filter.size + index + 1 }}</TbData>

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
import { computed, reactive, ref } from 'vue'
import { approvalReferrals } from '@/data/approvalReferralMock'

const filter = reactive({
    page: 1,
    size: 10,
    search: '',
    sortBy: '',
    orderBy: '',
})

const store = { filter }

const showApprovalModal = ref(false)
const selectedReferral = ref(null)

const openApprovalModal = (item) => {
    selectedReferral.value = item
    showApprovalModal.value = true
}

const filteredReferrals = computed(() => {
    const keyword = filter.search.trim().toLowerCase()
    if (!keyword) return approvalReferrals

    return approvalReferrals.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.usi.toLowerCase().includes(keyword)
    )
})

const total = computed(() => filteredReferrals.value.length)
const totalPage = computed(() => (filter.size > 0 ? Math.ceil(total.value / filter.size) : 0))

const pageIndex = computed(() => ({
    first: total.value === 0 ? 0 : (filter.page - 1) * filter.size + 1,
    last: Math.min(filter.page * filter.size, total.value),
    total: total.value,
}))

const paginatedReferrals = computed(() => {
    const start = (filter.page - 1) * filter.size
    return filteredReferrals.value.slice(start, start + filter.size)
})

const paginationFilter = computed(() => ({
    get page() { return filter.page },
    set page(value) { filter.page = value },
    get size() { return filter.size },
    set size(value) { filter.size = value },
    total_page: totalPage.value,
    page_index: pageIndex.value,
}))
</script>
