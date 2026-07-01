import { defineStore } from 'pinia'
import { axiosWrapper } from '@/services/axios'
import { storageHelper } from '@/helpers/storage'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.VITE_BASE_URL
const PARTNERSHIP_URL = import.meta.env.VITE_API_PARTNER_URL

interface LoginForm {
  username: string
  password: string
}
type OrganizationType = "personal" | "company" | "user";

interface UserInfo {
  username: string
  token: string
  organization_type?: OrganizationType
  webview?: boolean
  type?: string;
}
interface AuthState {
  user: UserInfo | null
  socket: Socket | null
  returnUrl: string | null
  organization_type?: string | null;

}

export const useAuthStore = defineStore('user', {
  state: (): AuthState => ({
    user: storageHelper.getItem('user') ? (storageHelper.getItem('user') as UserInfo) : null,
    socket: null,
    returnUrl: null,
  }),

  actions: {
    async login(form: LoginForm) {
      const res = await axiosWrapper.post(`${BASE_URL}/auth/login`, form)
      if (res.status === 200) {
        this.user = {
          username: form.username,
          token: res.data.token,
        }
        storageHelper.setItem('user', this.user)

        this.initSocket()
      }
    },

    async loginDev(form: LoginForm) {
      const res = await axiosWrapper.post(`${PARTNERSHIP_URL}/auth/login`, form)
      if (res.status === 200) {
        const token: string =
          res.data?.access_token ??
          res.data?.token ??
          res.access_token ??
          res.token ??
          ''

        this.user = {
          username: form.username,
          token,
        }
        storageHelper.setItem('user', this.user)

        this.initSocket()
      }
    },
    
    async loginWithToken(token: string) {
      try {
        const res = await axiosWrapper.get(`${BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        this.user = {
          username: res.data.username,
          token,
        }

        storageHelper.setItem('user', this.user)
        this.initSocket()
      } catch (err) {
        this.logout()
        throw err
      }
    },

    initSocket() {
      if (this.socket) return

      this.socket = io(import.meta.env.VITE_SOCKET_URL, {
        auth: {
          token: this.user?.token,
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
