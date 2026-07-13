<template>
    <PartialModal v-model="isOpen" :title="title" @close="resetForm">
        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
            <InputText v-model="name" name="major_name" label="Program Studi"
                placeholder="Masukkan nama program studi" required />
            <ButtonSelectOutlineGrey v-model="educationLevel" :options="educationLevelOptions"
                label="Jenjang Pendidikan" placeholder="Pilih jenjang pendidikan" required />
            <ButtonSelectOutlineGrey v-model="facultyId" :options="facultyOptions" label="Fakultas"
                placeholder="Pilih fakultas" required />

            <ButtonPrimary type="submit" class="w-full">
                {{ isEditMode ? 'Simpan Perubahan' : 'Tambah Fakultas' }}
            </ButtonPrimary>
        </form>

        <button v-if="isEditMode" type="button"
            class="mt-3 w-full text-center text-sm font-medium text-error-500 hover:underline" @click="requestDelete">
            Hapus Program Studi
        </button>
    </PartialModal>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useMajorstore } from '@/stores/university/major.store'
import { useFacultystore } from '@/stores/university/faculty.store'
import { useToastStore } from '@/stores/toast.store'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    major: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'saved', 'delete-requested'])

const majorStore = useMajorstore()
const facultyStore = useFacultystore()
const toastStore = useToastStore()

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const isEditMode = computed(() => !!props.major)
const title = computed(() => isEditMode.value ? 'Detail Program Studi' : 'Tambah Program Studi')

const name = ref('')
const educationLevel = ref(null)
const facultyId = ref(null)

const educationLevelOptions = [
    { value: 'S3 / Doktor', label: 'S3 / Doktor' },
    { value: 'S2 / Magister', label: 'S2 / Magister' },
    { value: 'S1 / Sarjana', label: 'S1 / Sarjana' },
    { value: 'D4 / Sarjana Terapan', label: 'D4 / Sarjana Terapan' },
    { value: 'D3', label: 'D3' },
    { value: 'D2', label: 'D2' },
    { value: 'D1', label: 'D1' },
]

const facultyOptions = computed(() =>
    facultyStore.allFaculties.map((faculty) => ({
        value: faculty.id,
        label: faculty.name,
    }))
)

const findFacultyIdByName = (facultyName) =>
    facultyStore.allFaculties.find((faculty) => faculty.name === facultyName)?.id ?? null

const resetForm = () => {
    name.value = ''
    educationLevel.value = null
    facultyId.value = null
}

const loadDetail = () => {
    name.value = props.major.major
    educationLevel.value = props.major.education_level
    facultyId.value = findFacultyIdByName(props.major.faculty)
}

watch(() => props.modelValue, (open) => {
    if (!open) return
    isEditMode.value ? loadDetail() : resetForm()
})

const handleSubmit = async () => {
    const trimmedName = name.value.trim()
    if (!trimmedName || !facultyId.value || !educationLevel.value) return

    const payload = {
        name: trimmedName,
        faculty_id: facultyId.value,
        education_level: educationLevel.value,
    }

    const success = isEditMode.value
        ? await majorStore.updateMajor(props.major.id, payload)
        : await majorStore.createMajor(payload)

    if (!success) {
        const fallback = isEditMode.value ? 'Gagal memperbarui program studi' : 'Gagal menambahkan program studi'
        toastStore.display('error', 'Gagal', majorStore.error || fallback)
        return
    }

    toastStore.display('success', 'Berhasil', isEditMode.value ? 'Program studi berhasil diperbarui' : 'Program studi berhasil ditambahkan')
    resetForm()
    isOpen.value = false
    emit('saved')
}

const requestDelete = () => {
    emit('delete-requested', props.major)
}

onMounted(() => {
    facultyStore.getAllFaculties()
})
</script>
