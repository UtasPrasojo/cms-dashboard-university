<template>
    <PartialModal v-model="isOpen" title="Tambah Mahasiswa" centered max-width="480px" @close="resetForm">
        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
            <InputText v-model="name" name="student_name" label="Nama Mahasiswa" placeholder="Masukkan nama mahasiswa"
                required />

            <InputRadioGroup v-model="gender" name="student_gender" label="Jenis Kelamin" flex required :values="[
                { name: 'Laki-laki', value: 'Laki-laki' },
                { name: 'Perempuan', value: 'Perempuan' },
            ]" />

            <InputText v-model="email" type="email" name="student_email" label="Email"
                placeholder="Masukkan email mahasiswa" required />

            <InputText v-model="cohort" name="student_cohort" label="Angkatan"
                placeholder="Masukkan angkatan mahasiswa" required />

            <InputText v-model="usi" name="student_usi" label="NIM" placeholder="Masukkan nim mahasiswa" required />

            <ButtonSelectOutlineGrey v-model="facultyId" label="Fakultas" :options="facultyOptions"
                placeholder="Pilih fakultas" required />

            <ButtonSelectOutlineGrey v-model="majorId" label="Program Studi" :options="majorOptions"
                placeholder="Pilih program studi" search-placeholder="Cari program studi" show-add-new
                add-new-label="Tambah program studi baru" :disabled="!facultyId" required
                @add-new="openAddMajorModal" />

            <div class="relative group w-full">
                <ButtonPrimary type="submit" class="w-full" :disabled="!isFormValid">
                    Tambah Mahasiswa
                </ButtonPrimary>

                <div v-if="!isFormValid"
                    class="hidden group-hover:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap items-center rounded-lg bg-base-black px-3 py-1.5 text-xs text-base-white">
                    Lengkapi data terlebih dahulu
                </div>
            </div>
        </form>

        <MasterDataModalDetailMajor v-model="showAddMajorModal" @saved="handleMajorSaved" />
    </PartialModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useManagementStore } from '@/stores/student/management_student.store'
import { useFacultystore } from '@/stores/university/faculty.store'
import { useToastStore } from '@/stores/toast.store'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'saved'])

const managementStore = useManagementStore()
const facultyStore = useFacultystore()
const toastStore = useToastStore()

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const name = ref('')
const gender = ref('')
const email = ref('')
const cohort = ref('')
const usi = ref('')
const facultyId = ref(null)
const majorId = ref(null)
const majorOptions = ref([])
const showAddMajorModal = ref(false)

const facultyOptions = computed(() =>
    facultyStore.allFaculties.map((faculty) => ({
        value: faculty.id,
        label: faculty.name,
    }))
)

const isFormValid = computed(() =>
    !!name.value.trim() &&
    !!gender.value &&
    !!email.value.trim() &&
    !!cohort.value.trim() &&
    !!usi.value.trim() &&
    !!facultyId.value &&
    !!majorId.value
)

const resetForm = () => {
    name.value = ''
    gender.value = ''
    email.value = ''
    cohort.value = ''
    usi.value = ''
    facultyId.value = null
    majorId.value = null
    majorOptions.value = []
}

const loadMajorsForFaculty = async (id) => {
    majorOptions.value = []
    if (!id) return

    const detail = await facultyStore.getFacultyById(id)
    majorOptions.value = (detail?.majors ?? []).map((major) => ({
        value: major.id,
        label: major.name,
    }))
}

const openAddMajorModal = () => {
    showAddMajorModal.value = true
}

const handleMajorSaved = () => {
    loadMajorsForFaculty(facultyId.value)
}

const handleSubmit = async () => {
    if (!isFormValid.value) return

    const payload = {
        name: name.value.trim(),
        gender: gender.value,
        email: email.value.trim(),
        cohort: cohort.value.trim(),
        usi: usi.value.trim(),
        faculty_id: facultyId.value,
        major_id: majorId.value,
    }

    const success = await managementStore.createStudent(payload)

    if (!success) {
        toastStore.display('error', 'Gagal', managementStore.error || 'Gagal menambahkan mahasiswa')
        return
    }

    toastStore.display('success', 'Berhasil', 'Mahasiswa berhasil ditambahkan')
    resetForm()
    isOpen.value = false
    emit('saved')
}

watch(() => props.modelValue, (open) => {
    if (!open) return
    resetForm()
    facultyStore.getAllFaculties()
})

watch(facultyId, (id) => {
    majorId.value = null
    loadMajorsForFaculty(id)
})
</script>
