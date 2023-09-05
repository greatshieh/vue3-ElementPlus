import Layout from '@/layout/index.vue'

const excelRouters = {
  path: '/excel',
  component: Layout,
  name: 'Excel',
  meta: { title: 'Excel', icon: 'excel' },
  children: [
    {
      path: 'download',
      component: () => import('@/views/excel/download.vue'),
      name: 'DownlaodExcel',
      meta: { title: '导出excel', icon: 'download' }
    },
    {
      path: 'upload',
      component: () => import('@/views/excel/upload.vue'),
      name: 'UploadExcel',
      meta: { title: '上传excel', icon: 'upload' }
    }
  ]
}

export default excelRouters
