<template>
  <header class="w-full flex items-center gap-3 px-4 py-3">
    <div class="relative w-full max-w-xs ">
      <i class="fi fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-text-300 text-sm leading-none"></i>
      <input
        type="text"
        placeholder="Cari di sini..."
        class="w-full bg-base-white rounded-full pl-10 pr-4 py-2.5 text-sm text-text-500 placeholder:text-text-300 focus:outline-none focus:ring-1 focus:ring-primary-500 shadow-lg"
      />
    </div>

    <div class="ml-auto flex items-center gap-3">
      <button
        type="button"
        class="flex items-center gap-2 bg-base-white rounded-full pl-4 pr-3 py-2.5 text-xs md:text-sm font-medium text-text-500 text-nowrap shadow-lg"
      >
        Semua Fakultas
        <i class="fi fi-rr-angle-small-down text-xs leading-none"></i>
      </button>

      <span class="w-9 h-9 rounded-full bg-base-white grid place-items-center text-base leading-none shrink-0 shadow-lg" title="Bahasa Indonesia">
        🇮🇩
      </span>

      <button type="button" class="relative w-9 h-9 rounded-full bg-base-white grid place-items-center text-text-500 shrink-0 shadow-lg" title="Notifikasi">
        <i class="fi fi-rr-bell text-base leading-none"></i>
        <span class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-error-500"></span>
      </button>

      <div class="w-9 h-9 rounded-full bg-primary-500 grid place-items-center shrink-0 overflow-hidden shadow-lg" :title="displayName">
        <p class="text-xs font-semibold text-base-white">{{ initials }}</p>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

const displayName = computed(() => authStore.user?.admin?.name ?? 'User')

const initials = computed(() => {
  const parts = displayName.value.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'U'
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase()
})
</script>
