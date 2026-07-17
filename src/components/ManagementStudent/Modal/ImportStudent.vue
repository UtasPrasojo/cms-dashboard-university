 <template>
    <PartialModal v-model="isOpen" title="Daftar Mahasiswa"  max-width="480px" @close="resetForm">
        <div class="flex flex-col gap-4">
            <p class="text-sm text-text-400">Unggah file CSV untuk melakukan proses import data.</p>

            <div class="grid gap-1">
                <label class="text-xs md:text-sm text-text-500 font-medium">
                    Upload file<span class="text-error-600">*</span>
                </label>

                <div class="relative group" @dragover.prevent @drop.prevent="handleDrop">
                    <input ref="fileInput" type="file" accept=".csv" @change="handleFileChange"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[2]" />

                    <div class="grid justify-items-center gap-2 text-center border-2 border-dashed border-border-300 rounded-2xl bg-base-light px-4 py-8 transition-colors group-hover:bg-primary-50"
                        :class="{ '!border-error-500': error }">
                        <template v-if="selectedFile">
                            <div class="flex items-center justify-center w-14 h-14 rounded-xl bg-success-100">
                                <i class="fi fi-rr-file-csv text-success-500 text-2xl !leading-none"></i>
                            </div>
                            <p class="text-primary-500 text-sm font-medium">{{ selectedFile.name }}</p>
                            <p class="text-text-300 text-xs">{{ (selectedFile.size / 1024).toFixed(2) }} KB</p>
                        </template>
                        <template v-else>
                            <i class="fi fi-rr-cloud-upload text-4xl text-primary-500"></i>
                            <p class="text-sm text-base-black">Click to Upload or drag &amp; drop</p>
                            <p class="text-xs text-text-300">(Max. File size: 5MB)</p>
                        </template>
                    </div>
                </div>

                <p v-if="error" class="text-xs text-error-500">{{ error }}</p>
            </div>

            <div class="flex items-center gap-3 rounded-xl border border-border-200 px-3 py-2">
                <div class="flex items-center justify-center w-9 h-9 rounded-lg bg-success-100 flex-none">
                    <i class="fi fi-rr-file-csv text-success-500 !leading-none"></i>
                </div>
                <p class="flex-1 text-sm text-base-black truncate">template-mahasiswa.csv</p>
                <button type="button" title="Unduh template" @click="handleDownloadTemplate"
                    class="flex items-center justify-center w-9 h-9 rounded-lg bg-base-dark text-base-white flex-none hover:bg-base-black">
                    <i class="fi fi-rr-download text-xs !leading-none"></i>
                </button>
            </div>

            <ButtonPrimary type="button" class="w-full" :disabled="!selectedFile" @click="handleImport">
                Import CSV
            </ButtonPrimary>
        </div>
    </PartialModal>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useManagementStore } from '@/stores/student/management_student.store'
import { useToastStore } from '@/stores/toast.store'
import { importStudentFileSchema } from '@/stores/student/type/management_student'
import { validate } from '@/utils/validate'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'saved'])

const managementStore = useManagementStore()
const toastStore = useToastStore()

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const fileInput = ref(null)
const selectedFile = ref(null)
const error = ref(null)

const resetInput = () => {
    if (fileInput.value) fileInput.value.value = ''
}

const resetForm = () => {
    selectedFile.value = null
    error.value = null
    resetInput()
}

const applyFile = (file) => {
    if (!file) return

    error.value = null

    const result = validate(importStudentFileSchema, { file })

    if (!result.success) {
        error.value = Object.values(result.errors)[0]
        resetInput()
        return
    }

    selectedFile.value = result.data.file
}

const handleFileChange = (event) => {
    applyFile(event.target.files?.[0])
}

const handleDrop = (event) => {
    applyFile(event.dataTransfer?.files?.[0])
}

const handleDownloadTemplate = async () => {
    const success = await managementStore.downloadCsvTemplate()

    if (!success) {
        toastStore.display('error', 'Gagal', managementStore.error || 'Gagal mengunduh template')
    }
}

const handleImport = async () => {
    if (!selectedFile.value) return

    const success = await managementStore.importStudents(selectedFile.value)

    if (!success) {
        toastStore.display('error', 'Gagal', managementStore.error || 'Gagal mengimpor data mahasiswa')
        return
    }

    toastStore.display('success', 'Berhasil', 'Data mahasiswa berhasil diimpor')
    resetForm()
    isOpen.value = false
    emit('saved')
}
</script>
