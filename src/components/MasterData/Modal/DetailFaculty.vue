<template>
    <PartialModal v-model="isOpen" :title="title" @close="resetForm">
        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
            <InputText v-model="name" name="faculty_name" label="Fakultas" placeholder="Masukkan nama fakultas"
                required />

            <div class="rounded-xl bg-base-section p-4" v-if="isEditMode">
                <p class="text-sm font-semibold text-base-black mb-2">Program Studi</p>
                <p v-if="facultyDetailLoading" class="text-sm text-text-400">Memuat...</p>
                <ul v-else-if="facultyMajors.length" class="list-disc list-inside text-sm text-text-400 space-y-1">
                    <li v-for="major in facultyMajors" :key="major.id">{{ major.name }}</li>
                </ul>
                <p v-else class="text-sm text-text-400">Belum ada program studi</p>
            </div>

            <ButtonPrimary type="submit" class="w-full">
                {{ isEditMode ? 'Simpan Perubahan' : 'Tambah Fakultas' }}
            </ButtonPrimary>
        </form>

        <button v-if="isEditMode" type="button"
            class="mt-3 w-full text-center text-sm font-medium text-error-500 hover:underline" @click="requestDelete">
            Hapus Fakultas
        </button>
    </PartialModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useFacultystore } from '@/stores/university/faculty.store'
import { useToastStore } from '@/stores/toast.store'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    faculty: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'saved', 'delete-requested'])

const facultyStore = useFacultystore()
const toastStore = useToastStore()

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const isEditMode = computed(() => !!props.faculty)
const title = computed(() => isEditMode.value ? 'Detail Fakultas' : 'Tambah Fakultas')

const name = ref('')
const facultyMajors = ref([])
const facultyDetailLoading = ref(false)

const resetForm = () => {
    name.value = ''
    facultyMajors.value = []
}

const loadDetail = async () => {
    name.value = props.faculty.name
    facultyMajors.value = []
    facultyDetailLoading.value = true
    const detail = await facultyStore.getFacultyById(props.faculty.id)
    facultyDetailLoading.value = false

    if (detail) {
        facultyMajors.value = detail.majors
    }
}

watch(() => props.modelValue, (open) => {
    if (!open) return
    isEditMode.value ? loadDetail() : resetForm()
})

const handleSubmit = async () => {
    const trimmedName = name.value.trim()
    if (!trimmedName) return

    const success = isEditMode.value
        ? await facultyStore.updateFaculty(props.faculty.id, { name: trimmedName })
        : await facultyStore.createFaculty({ name: trimmedName })

    if (!success) {
        const fallback = isEditMode.value ? 'Gagal memperbarui fakultas' : 'Gagal menambahkan fakultas'
        toastStore.display('error', 'Gagal', facultyStore.error || fallback)
        return
    }

    toastStore.display('success', 'Berhasil', isEditMode.value ? 'Fakultas berhasil diperbarui' : 'Fakultas berhasil ditambahkan')
    resetForm()
    isOpen.value = false
    emit('saved')
}

const requestDelete = () => {
    emit('delete-requested', props.faculty)
}
</script>
