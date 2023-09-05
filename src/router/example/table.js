import Layout from '@/layout/index.vue'

const tableRouters = {
  path: '/table',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/table/index.vue'),
      name: 'Table',
      meta: { title: '综合表格', icon: 'table' }
    }
  ]
}

export default tableRouters
