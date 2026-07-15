<template>
    <div v-if="isOpen" class="fixed inset-0 z-40" @click="isOpen = false"></div>

    <Transition name="filter-popover">
        <div v-if="isOpen"
            class="filter-popover absolute right-0 top-[calc(100%+8px)] z-50 w-[380px] sm:w-[380px] max-h-[70vh] flex flex-col rounded-2xl bg-base-white border border-border-200 shadow-xl">
            <div class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border-200 flex-none">
                <p class="text-sm md:text-base font-bold text-base-black">Filter</p>
                <button type="button" @click="isOpen = false"
                    class="flex-none w-[30px] h-[30px] rounded-lg bg-base-light border flex items-center justify-center">
                    <i class="ri-close-line text-sm"></i>
                </button>
            </div>

            <div class="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-5">
                <div v-for="(group, index) in groups" :key="group.key"
                    :class="index < groups.length - 1 ? 'pb-5 border-b border-border-200' : ''">
                    <p class="font-semibold text-sm md:text-base text-base-black mb-3">{{ group.title }}</p>

                    <p v-if="!group.options.length" class="text-sm text-text-300">Belum ada data</p>

                    <div v-else class="grid grid-cols-2 gap-x-4 gap-y-3">
                        <label v-for="option in group.options" :key="option.value"
                            class="flex items-center gap-2 text-sm text-text-400 cursor-pointer">
                            <InputCheckbox :value="group.selected.value.includes(option.value)"
                                @update="toggleOption(group.selected, option.value)" />
                            {{ option.label }}
                        </label>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-3 w-full px-5 py-4 border-t border-border-200 flex-none">
                <button type="button" title="Hapus semua filter" @click="handleReset"
                    class="flex-none w-12 h-12 rounded-full bg-error-100 text-error-500 flex items-center justify-center hover:bg-error-200">
                    <i class="fi fi-rr-trash"></i>
                </button>

                <ButtonPrimary type="button" class="flex-1" @click="handleApply">
                    Terapkan Filter
                </ButtonPrimary>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useManagementStore } from '@/stores/student/management_student.store'
import { useFacultystore } from '@/stores/university/faculty.store'
import { useMajorstore } from '@/stores/university/major.store'
import { useDashboardStore } from '@/stores/university/dashboard.store'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const managementStore = useManagementStore()
const facultyStore = useFacultystore()
const majorStore = useMajorstore()
const dashboardStore = useDashboardStore()

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})

const nineBoxPositionOptions = [
    'Talent Unggulan',
    'Profil Solid',
    'Bintang Berkembang',
    'Perlu Pendampingan',
    'Bakat Terpendam',
    'Tekun & Konsisten',
    'Pekerja Keras Berprestasi',
    'Perlu Dorongan',
].map((label) => ({ value: label, label }))

const selectedFacultyIds = ref([])
const selectedMajorIds = ref([])
const selectedNineBoxPositions = ref([])
const selectedArchetypes = ref([])

const facultyOptions = computed(() =>
    facultyStore.allFaculties.map((faculty) => ({ value: faculty.id, label: faculty.name }))
)

const majorOptions = computed(() =>
    majorStore.allMajors.map((major) => ({ value: major.id, label: major.major }))
)

const archetypeOptions = computed(() =>
    (dashboardStore.archetypePersonality ?? []).map((archetype) => ({ value: archetype.code, label: archetype.name }))
)

const groups = computed(() => [
    { key: 'faculty', title: 'Fakultas', options: facultyOptions.value, selected: selectedFacultyIds },
    { key: 'major', title: 'Program Studi', options: majorOptions.value, selected: selectedMajorIds },
    { key: 'ninebox', title: 'Posisi 9 Box', options: nineBoxPositionOptions, selected: selectedNineBoxPositions },
    { key: 'archetype', title: 'Archetype', options: archetypeOptions.value, selected: selectedArchetypes },
])

const toggleOption = (selected, value) => {
    selected.value = selected.value.includes(value)
        ? selected.value.filter((item) => item !== value)
        : [...selected.value, value]
}

const syncFromStore = () => {
    selectedFacultyIds.value = [...managementStore.filter.facultyIds]
    selectedMajorIds.value = [...managementStore.filter.majorIds]
    selectedNineBoxPositions.value = [...managementStore.filter.nineBoxPositions]
    selectedArchetypes.value = [...managementStore.filter.archetypes]
}

const handleApply = () => {
    managementStore.filter.page = 1
    managementStore.filter.facultyIds = [...selectedFacultyIds.value]
    managementStore.filter.majorIds = [...selectedMajorIds.value]
    managementStore.filter.nineBoxPositions = [...selectedNineBoxPositions.value]
    managementStore.filter.archetypes = [...selectedArchetypes.value]
    isOpen.value = false
}

const handleReset = () => {
    selectedFacultyIds.value = []
    selectedMajorIds.value = []
    selectedNineBoxPositions.value = []
    selectedArchetypes.value = []
    handleApply()
}

watch(() => props.modelValue, (open) => {
    if (!open) return
    syncFromStore()
    if (!facultyStore.allFaculties.length) facultyStore.getAllFaculties()
    if (!majorStore.allMajors.length) majorStore.getAllMajors()
    if (!dashboardStore.archetypePersonality) dashboardStore.getArchetypePersonality()
})
</script>

<style scoped>
.filter-popover-enter-active,
.filter-popover-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.filter-popover-enter-from,
.filter-popover-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
