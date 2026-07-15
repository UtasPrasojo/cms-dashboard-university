<template>
    <Teleport to="#app">
        <div v-if="modelValue" @click.self="handleClose"
            class="z-50 fixed left-0 top-0 grid justify-items-center content-center w-screen h-screen bg-base-black/40 p-5">
            <div class="flex flex-col bg-base-white w-full max-w-[420px] rounded-2xl elevation-6 overflow-hidden">
                <div class="flex items-center justify-between p-4">
                    <p class="text-sm md:text-base font-bold text-base-black">Approval Mahasiswa</p>
                    <button type="button" @click="handleClose"
                        class="flex items-center justify-center flex-none w-8 h-8 rounded-lg bg-base-light border">
                        <i class="ri-close-line text-sm !leading-none"></i>
                    </button>
                </div>

                <div class="flex items-center gap-3 px-4 pb-4">
                    <div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 flex-none">
                        <p class="text-sm font-semibold text-base-white">{{ initials }}</p>
                    </div>
                    <div class="flex flex-col">
                        <p class="text-sm font-bold text-base-black">{{ student?.name }}</p>
                        <p class="text-xs text-text-300">NIM {{ student?.usi }}</p>
                    </div>
                </div>

                <hr />

                <div class="flex flex-col gap-3 px-4 py-4">
                    <div class="flex items-center justify-between gap-4">
                        <p class="text-sm text-text-400">Email</p>
                        <p class="text-sm text-base-black text-right">{{ student?.email }}</p>
                    </div>
                    <div class="flex items-center justify-between gap-4">
                        <p class="text-sm text-text-400">Fakultas</p>
                        <p class="text-sm text-base-black text-right">{{ student?.faculty }}</p>
                    </div>
                    <div class="flex items-center justify-between gap-4">
                        <p class="text-sm text-text-400">Program Studi</p>
                        <p class="text-sm text-base-black text-right">{{ student?.major }}</p>
                    </div>
                </div>

                <hr />

                <div class="flex items-center justify-between gap-4 p-4">
                    <p class="text-xs text-text-300">{{ submittedText }}</p>
                    <div class="flex items-center gap-2">
                        <ButtonDanger size="small" @click="handleReject">Tolak</ButtonDanger>
                        <ButtonPrimary size="small" @click="handleApprove">Setujui</ButtonPrimary>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import moment from 'moment'
import { useToastStore } from '@/stores/toast.store'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    student: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'approved', 'rejected'])

const toastStore = useToastStore()

const initials = computed(() => {
    const name = props.student?.name?.trim()
    if (!name) return ''

    const parts = name.split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
})

const submittedText = computed(() => {
    if (!props.student?.submitted_at) return ''
    const days = moment().diff(moment(props.student.submitted_at), 'days')
    return `Diajukan ${days} Hari lalu`
})

const handleClose = () => {
    emit('update:modelValue', false)
}

const handleApprove = () => {
    toastStore.display('success', 'Berhasil', 'Pengajuan referral telah disetujui')
    emit('approved', props.student)
    handleClose()
}

const handleReject = () => {
    toastStore.display('success', 'Berhasil', 'Pengajuan referral telah ditolak')
    emit('rejected', props.student)
    handleClose()
}
</script>
