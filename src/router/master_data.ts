import FacultyView from '@/views/university/master-data/faculty/index.vue'
import MajorView from '@/views/university/master-data/major/index.vue'



export default [
  {
    path: '/master-data/faculty',
    name: 'master-data.faculty',
    component: FacultyView,
    meta: {
      title: 'Faculty',
    },
  },
  {
    path: '/master-data/major',
    name: 'master-data.major',
    component: MajorView,
    meta: {
      title: 'Major',
    },
  },



]