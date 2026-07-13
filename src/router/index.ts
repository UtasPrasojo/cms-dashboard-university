import { createRouter, createWebHistory } from 'vue-router'

import auth from './auth'
import dashboard from './dashboard'
import masterData from './master_data'
import { useAuthStore } from '@/stores/auth.store'

const arr_routes = [auth,dashboard,masterData]
const routes = arr_routes.flat(1)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  if (to.path !== '/') return

  const authStore = useAuthStore()
  const isLoggedIn = !!authStore.user?.access_token

  return isLoggedIn ? { name: 'dashboard' } : { name: 'auth.login' }
})

export default router
