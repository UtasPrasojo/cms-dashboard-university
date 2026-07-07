import { defineStore } from 'pinia'
import { axiosWrapper } from '@/services/axios'
import { storageHelper } from '@/helpers/storage'
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
    async login(form: LoginForm) {
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
      }

      return res
    },

    async refreshToken() {
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
