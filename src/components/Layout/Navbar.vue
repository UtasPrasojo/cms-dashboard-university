<template>
  <aside class="flex flex-col shrink-0 h-full bg-base-white rounded-3xl p-4 transition-all duration-200"
    :class="collapsed ? 'w-[77px]' : 'w-[240px]'">
    <div class="flex gap-2 pb-4 border-b border-border-200"
      :class="collapsed ? 'flex-col items-center' : 'flex-row items-center justify-between'">
      <RouterLink to="/dashboard" class="flex justify-center items-center overflow-hidden">
        <div v-if="collapsed" class="w-9 h-9 grid place-items-center rounded-full bg-primary-500 shrink-0">
          <img src="@/assets/images/logo-white.svg" alt="Jenjang" class="h-4 w-4 object-contain" />
        </div>
        <img v-else src="@/assets/images/logo.svg" alt="Jenjang" class="h-6 w-auto shrink-0" />
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
        <component :is="item.icon" v-if="typeof item.icon !== 'string'" class="w-4 h-4 shrink-0" />
        <i v-else :class="item.icon" class="text-base leading-none shrink-0"></i>
        <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <button type="button" title="Keluar"
      class="flex items-center gap-3 px-4 py-3 mt-4 rounded-3xl text-sm font-semibold text-base-white bg-error-500 hover:bg-error-600 transition-colors"
      :class="collapsed ? 'justify-center' : ''" @click="handleLogout">
      <IconLogout class="w-4 h-4 shrink-0 text-white" />
      <span v-if="!collapsed" class="truncate">Keluar</span>
    </button>
  </aside>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import Dashboard from '@/components/Icon/Dashboard.vue'
import Information from '@/components/Icon/Information.vue'
import Settings from '@/components/Icon/Setting.vue'
import List from '@/components/Icon/List.vue'
import Social from '@/components/Icon/SocialNetwork.vue'
import Logout from '@/components/Icon/Logout.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const collapsed = ref(false)

const menuItems = [
  { label: 'Dashboard', icon: Dashboard, to: '/dashboard' },
  { label: 'Campus Health Index', icon: List, to: '/campus-health' },
  { label: 'Mahasiswa', icon: Social, to: '/management-student' },
  { label: 'Informasi', icon: Information, to: '/informasi' },
  { label: 'Pengaturan', icon: Settings, to: '/pengaturan' },
]

const isActive = (to) => route.path === to || route.path.startsWith(`${to}/`)

const handleLogout = () => {
  authStore.logout()
  router.push('/auth/login')
}
</script>