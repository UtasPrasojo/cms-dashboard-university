import { defineStore } from 'pinia'
import { axiosWrapper } from '@/services/axios'
import { storageHelper } from '@/helpers/storage'
import { useToastStore } from '@/stores/toast.store'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.VITE_BASE_URL

interface LoginForm {
  username: string
  password: string
}

interface AdminInfo {
  id: string
  email: string
  name: string
}

interface UserInfo {
  account_id: string
  admin: AdminInfo
  access_token: string
  refresh_token: string
}

interface AuthState {
  user: UserInfo | null
  socket: Socket | null
  returnUrl: string | null
}

export const useAuthStore = defineStore('user', {
  state: (): AuthState => ({
    user: storageHelper.getItem('user') ? (storageHelper.getItem('user') as UserInfo) : null,
    socket: null,
    returnUrl: null,
  }),

  actions: {
    async login(form: LoginForm, options?: { toast?: boolean }) {
      const toast = options?.toast ?? false
      const toastStore = useToastStore()

      const res = await axiosWrapper.post(`${BASE_URL}/auth/university/login`, {
        email: form.username,
        password: form.password,
      })

      if (res.status === 200) {
        this.user = {
          account_id: res.data.account_id,
          admin: res.data.admin,
          access_token: res.data.access_token,
          refresh_token: res.data.refresh_token,
        }
        storageHelper.setItem('user', this.user)

        this.initSocket()

        if (toast) toastStore.display('success', 'Berhasil', res.message ?? 'Login berhasil')
      } else if (toast) {
        toastStore.display('error', 'Gagal', res.data?.message ?? 'Login gagal, silakan coba lagi')
      }

      return res
    },

    async refreshToken(options?: { toast?: boolean }) {
      const toast = options?.toast ?? false
      const toastStore = useToastStore()

      if (!this.user?.refresh_token) throw new Error('No refresh token available')

      const res = await axiosWrapper.post(`${BASE_URL}/auth/refresh`, {
        refresh_token: this.user.refresh_token,
      })

      if (res.status === 200) {
        this.user = {
          account_id: res.data.account_id ?? this.user.account_id,
          admin: res.data.admin ?? this.user.admin,
          access_token: res.data.access_token,
          refresh_token: res.data.refresh_token ?? this.user.refresh_token,
        }
        storageHelper.setItem('user', this.user)

        if (toast) toastStore.display('success', 'Berhasil', res.message ?? 'Token berhasil diperbarui')
      } else if (toast) {
        toastStore.display('error', 'Gagal', res.data?.message ?? 'Gagal memperbarui token')
      }

      return res
    },

    initSocket() {
      if (this.socket) return

      this.socket = io(import.meta.env.VITE_SOCKET_URL, {
        auth: {
          token: this.user?.access_token,
        },
      })
    },

    logout() {
      this.socket?.disconnect()
      this.socket = null

      this.user = null
      storageHelper.clear()
    },
  },
})
