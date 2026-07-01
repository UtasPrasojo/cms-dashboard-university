import { createRouter, createWebHistory } from 'vue-router'

import auth from './auth'
import dashboard from './dashboard'
import { useAuthStore } from '@/stores/auth.store'

const arr_routes = [auth,dashboard]
const routes = arr_routes.flat(1)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

let authBootstrapped = false

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  const token = to.query.token as string | undefined

  if (token && !authStore.user && !authBootstrapped) {
    authBootstrapped = true

    try {
      await authStore.loginWithToken(token)

      next({
        path: to.path,
        query: {},
        replace: true,
      })
      return
    } catch {
      next('/auth/login')
      return
    }
  }
  

  next()
})

export default router
