<template>
  <header class="w-full flex items-center gap-3 px-4 py-3">
    <div class="relative w-full max-w-xs">
      <i class="fi fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-text-300 text-sm leading-none"></i>
      <input
        type="text"
        placeholder="Cari di sini..."
        class="w-full bg-base-white rounded-full pl-10 pr-4 py-2.5 text-sm text-text-500 placeholder:text-text-300 focus:outline-none focus:ring-1 focus:ring-primary-500 shadow-lg"
      />
    </div>

    <div class="ml-auto flex items-center gap-3">
      <div class="relative" ref="dropdownRef">
        <button
          type="button"
          class="flex items-center gap-2 bg-base-white rounded-full pl-4 pr-3 py-2.5 text-xs md:text-sm font-medium text-text-500 text-nowrap shadow-lg"
          @click="toggleDropdown"
        >
          {{ selectedFacultyLabel }}
          <i
            class="fi fi-rr-angle-small-down text-xs leading-none transition-transform"
            :class="isOpen ? 'rotate-180' : ''"
          ></i>
        </button>

        <div
          v-if="isOpen"
          class="absolute right-0 mt-2 w-56 max-h-72 overflow-y-auto bg-base-white rounded-2xl shadow-xl py-2 z-30"
        >
          <button
            type="button"
            class="w-full text-left px-4 py-2 text-xs md:text-sm hover:bg-base-section"
            :class="selectedFaculty === null ? 'text-primary-500 font-semibold' : 'text-text-500'"
            @click="selectFaculty(null)"
          >
            Semua Fakultas
          </button>

          <div v-if="facultyStore.loading" class="px-4 py-2 text-xs text-text-300">
            Memuat...
          </div>

          <div v-else-if="facultyStore.error" class="px-4 py-2 text-xs text-error-500">
            {{ facultyStore.error }}
          </div>

          <button
            v-else
            v-for="item in facultyStore.allFaculties"
            :key="item.id"
            type="button"
            class="w-full text-left px-4 py-2 text-xs md:text-sm hover:bg-base-section"
            :class="selectedFaculty === item.id ? 'text-primary-500 font-semibold' : 'text-text-500'"
            @click="selectFaculty(item.id)"
          >
            {{ item.name }}
          </button>
        </div>
      </div>

      <span
        class="w-9 h-9 rounded-full bg-base-white grid place-items-center text-base leading-none shrink-0 shadow-lg"
        title="Bahasa Indonesia"
      >
        <img src="@/assets/images/dashboard/indonesia-flag.png" class="w-[18px] h-[18px] object-contain" alt="">
      </span>

      <button
        type="button"
        class="relative w-9 h-9 rounded-full bg-base-white grid place-items-center text-text-500 shrink-0 shadow-lg"
        title="Notifikasi"
      >
        <IconBell class="w-5 h-5" />
        <span class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-error-500"></span>
      </button>

      <div
        class="w-9 h-9 rounded-full bg-primary-500 grid place-items-center shrink-0 overflow-hidden shadow-lg"
        :title="displayName"
      >
        <p class="text-xs font-semibold text-base-white">{{ initials }}</p>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useFacultystore } from '@/stores/university/faculty.store'

const emit = defineEmits<{
  'update:faculty': [facultyId: string | null]
}>()

const authStore = useAuthStore()
const facultyStore = useFacultystore()

const displayName = computed(() => authStore.user?.admin?.name ?? 'User')

const initials = computed(() => {
  const parts = displayName.value.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'U'
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase()
})

const isOpen = ref(false)
const selectedFaculty = ref<string | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)

const selectedFacultyLabel = computed(() => {
  if (!selectedFaculty.value) return 'Semua Fakultas'
  return facultyStore.allFaculties.find((item) => item.id === selectedFaculty.value)?.name ?? 'Semua Fakultas'
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectFaculty(facultyId: string | null) {
  selectedFaculty.value = facultyId
  isOpen.value = false
  emit('update:faculty', facultyId)
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  facultyStore.getAllFaculties()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>