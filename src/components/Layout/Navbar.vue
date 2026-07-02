<template>
  <aside class="flex flex-col shrink-0 h-full bg-base-white rounded-3xl p-4 transition-all duration-200"
    :class="collapsed ? 'w-[77px]' : 'w-[240px]'">
    <div class="flex gap-2 pb-4 border-b border-border-200"
      :class="collapsed ? 'flex-col items-center' : 'flex-row items-center justify-between'">
      <RouterLink to="/dashboard" class="flex justify-center items-center overflow-hidden">
        <img src="@/assets/images/logo.svg" alt="Jenjang" class="h-6 w-auto shrink-0"
          :class="collapsed ? 'w-6 object-cover object-left' : ''" />
      </RouterLink>
      <button type="button" title="Sembunyikan menu"
        class="w-7 h-7 grid place-items-center rounded-lg text-text-400 shrink-0 hover:bg-base-section"
        @click="collapsed = !collapsed">
        <i class="fi fi-rr-angle-double-small-left text-xs leading-none transition-transform"
          :class="collapsed ? 'rotate-180' : ''"></i>
      </button>
    </div>

    <nav class="flex flex-col gap-1 mt-5">
      <RouterLink v-for="item in menuItems" :key="item.to" :to="item.to" :title="item.label"
        class="flex items-center gap-3 px-4 py-3 rounded-3xl text-sm font-medium transition-colors" :class="[
          isActive(item.to) ? 'bg-primary-500 text-base-white' : 'text-text-400 hover:bg-base-section',
          collapsed ? 'justify-center' : ''
        ]">
        <i :class="item.icon" class="text-base leading-none shrink-0"></i>
        <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <button type="button" title="Keluar"
      class="flex items-center gap-3 px-4 py-3 mt-4 rounded-3xl text-sm font-semibold text-base-white bg-error-500 hover:bg-error-600 transition-colors"
      :class="collapsed ? 'justify-center' : ''" @click="handleLogout">
      <i class="fi fi-rr-sign-out-alt text-base leading-none shrink-0"></i>
      <span v-if="!collapsed" class="truncate">Keluar</span>
    </button>
  </aside>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const collapsed = ref(false)

const menuItems = [
  { label: 'Dashboard', icon: 'fi fi-rr-apps', to: '/dashboard' },
  { label: 'Campus Health Index', icon: 'fi fi-rr-chart-histogram', to: '/campus-health-index' },
  { label: 'Mahasiswa', icon: 'fi fi-rr-graduation-cap', to: '/management-student' },
  { label: 'Informasi', icon: 'fi fi-rr-info', to: '/informasi' },
  { label: 'Pengaturan', icon: 'fi fi-rr-settings', to: '/pengaturan' },
]

const isActive = (to) => route.path === to || route.path.startsWith(`${to}/`)

const handleLogout = () => {
  authStore.logout()
  router.push('/auth/login')
}
</script>
