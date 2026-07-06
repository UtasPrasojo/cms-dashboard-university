import dashboardView from '@/views/university/dashboard/index.vue'
import ManagementView from '@/views/university/management-student/index.vue'
import CampusHealth from '@/views/university/campus-health/index.vue'


export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: dashboardView,
    meta: {
      title: 'Dashboard',
    },
  },
  {
    path: '/management-student',
    name: 'management-student',
    component: ManagementView,
    meta: {
      title: 'Management Student',
    },
  },
  {
    path: '/campus-health',
    name: 'campus-health',
    component: CampusHealth,
    meta: {
      title: 'Campus Health',
    },
  },


]