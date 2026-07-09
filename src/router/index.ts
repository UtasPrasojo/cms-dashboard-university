import { createRouter, createWebHistory } from 'vue-router'

import auth from './auth'
import dashboard from './dashboard'
import masterData from './master_data'

const arr_routes = [auth,dashboard,masterData]
const routes = arr_routes.flat(1)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
