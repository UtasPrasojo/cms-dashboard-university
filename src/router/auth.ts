import LoginView from '@/views/auth/login/index.vue'
import HomeView from '@/views/HomeView.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Home',
    },
  },
  {
    path: '/auth/login',
    name: 'auth.login',
    component: LoginView,
    meta: {
      title: 'Login',
    },
  },

]