import dashboardView from '@/views/university/dashboard/index.vue'
import ManagementView from '@/views/university/management-student/index.vue'


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
 

]