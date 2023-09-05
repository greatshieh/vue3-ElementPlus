import Layout from '@/layout/index.vue'

const componentRouters = {
  path: '/component-demo',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Demo',
  meta: { title: '组件', icon: 'component' },
  children: [
    {
      path: 'count-to',
      component: () => import('@/views/demo/CountTo.vue'),
      name: 'CountToDemo',
      meta: { title: 'Count to' }
    },
    {
      path: 'drag-kanban',
      component: () => import('@/views/demo/DragKanban.vue'),
      name: 'DragKanBan',
      meta: { title: '可拖拽看板' }
    },
    {
      path: 'editor',
      component: () => import('@/views/demo/Editor.vue'),
      name: 'Editor',
      meta: { title: '富文本编辑器' }
    }
  ]
}

export default componentRouters
