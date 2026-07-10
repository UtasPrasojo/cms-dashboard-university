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
      :class="collapsed ? 'justify-center' : ''" @click="openLogoutConfirm">
      <IconLogout class="w-4 h-4 shrink-0 text-white" />
      <span v-if="!collapsed" class="truncate">Keluar</span>
    </button>

    <!-- Modal Konfirmasi Logout -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showLogoutConfirm"
          class="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
          @click.self="closeLogoutConfirm"
        >
          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showLogoutConfirm"
              class="w-full max-w-sm bg-base-white rounded-3xl shadow-xl p-6"
            >
              <div class="w-12 h-12 rounded-full bg-error-100 grid place-items-center mb-4">
                <i class="fi fi-rr-exclamation text-error-500 text-xl leading-none"></i>
              </div>

              <h3 class="text-lg font-bold text-base-black">
                Keluar dari akun?
              </h3>
              <p class="mt-1 text-sm text-text-400">
                Kamu akan keluar dari sesi ini dan perlu login kembali untuk mengakses dashboard.
              </p>

              <div class="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-500 border border-border-300 hover:bg-base-section transition-colors"
                  @click="closeLogoutConfirm"
                >
                  Batal
                </button>
                <button
                  type="button"
                  class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-base-white bg-error-500 hover:bg-error-600 transition-colors"
                  @click="confirmLogout"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </aside>
</template>

<script setup lang="ts">
import { ref,  } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import Dashboard from '@/components/Icon/Dashboard.vue'
import Information from '@/components/Icon/Information.vue'
import Settings from '@/components/Icon/Setting.vue'
import List from '@/components/Icon/List.vue'
import Social from '@/components/Icon/SocialNetwork.vue'
import IconLogout from '@/components/Icon/Logout.vue'

interface MenuItem {
  label: string
  icon: unknown
  to: string
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const collapsed = ref(false)
const showLogoutConfirm = ref(false)

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: Dashboard, to: '/dashboard' },
  { label: 'Campus Health Index', icon: List, to: '/campus-health' },
  { label: 'Mahasiswa', icon: Social, to: '/management-student' },
  { label: 'Informasi', icon: Information, to: '/informasi' },
  { label: 'Pengaturan', icon: Settings, to: '/pengaturan' },
]

const isActive = (to: string): boolean =>
  route.path === to || route.path.startsWith(`${to}/`)

function openLogoutConfirm(): void {
  showLogoutConfirm.value = true
}

function closeLogoutConfirm(): void {
  showLogoutConfirm.value = false
}

function confirmLogout(): void {
  authStore.logout()
  showLogoutConfirm.value = false
  router.push('/auth/login')
}
</script>