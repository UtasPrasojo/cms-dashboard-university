<template>
    <div class="relative min-h-screen overflow-hidden ">

        <div class="absolute inset-0 pointer-events-none">
          

            <div class="absolute bottom-4 right-0 w-[300px] h-[300px] rounded-full bg-primary-500 opacity-30 blur-3xl">
            </div>
        </div>

    
        <div class="relative z-10 w-full flex flex-col gap-4 p-6">
         <h2 class="text-[21px]">Manajemen Mahasiswa</h2>

         <ButtonTab v-model="activeTab" :menu="tabMenu" />

         <DashboardTableManagementStudent v-if="activeTab === 'students'" />
         <DashboardTableApprovalReferral v-else />
        </div>

    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useApprovalStore } from '@/stores/student/approval.store'

const approvalStore = useApprovalStore()

const activeTab = ref('students')

const tabMenu = computed(() => [
    { label: 'Daftar Mahasiswa', value: 'students' },
    { label: 'Approval Referral', value: 'referral', count: approvalStore.filter.total },
])

onMounted(() => {
    approvalStore.getApprovals()
})
</script>