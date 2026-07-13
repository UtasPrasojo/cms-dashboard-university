<template>
    <PartialModal v-model="isOpen" :title="title" centered max-width="420px" @close="resetForm">
        <div class="flex flex-col gap-4">
            <p class="text-sm text-text-400">
                Apakah Anda yakin ingin menghapus {{ entityLabel }}
                "<strong class="text-base-black">{{ name }}</strong>". Aksi ini tidak dapat
                dibatalkan dan {{ entityLabel }} akan terhapus secara permanen.
            </p>
            <InputText v-model="confirmName" name="delete_confirm_name" :placeholder="`Masukkan nama ${entityLabel}`" />
        </div>

        <template #footer>
            <div class="grid grid-cols-2 gap-3 w-full">
                <ButtonPrimaryOutline @click="isOpen = false">
                    Batal
                </ButtonPrimaryOutline>
                <ButtonDanger :disabled="!isConfirmed" @click="handleDelete">
                    Hapus
                </ButtonDanger>
            </div>
        </template>
    </PartialModal>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    title: { type: String, required: true },
    entityLabel: { type: String, required: true },
    name: { type: String, default: '' },
    confirmAction: { type: Function, required: true },
})

const emit = defineEmits(['update:modelValue', 'deleted'])

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const confirmName = ref('')

const isConfirmed = computed(() =>
    !!props.name && confirmName.value.trim() === props.name
)

const resetForm = () => {
    confirmName.value = ''
}

const handleDelete = async () => {
    if (!isConfirmed.value) return

    const success = await props.confirmAction()
    if (!success) return

    resetForm()
    isOpen.value = false
    emit('deleted')
}
</script>
