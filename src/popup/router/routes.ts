import type { RouteRecordRaw } from 'vue-router'
import PageIndex from './pages/Index.vue'
import PageOptions from './pages/Options.vue'
import PageService from './pages/Service.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', component: PageIndex },
  { path: '/options', component: PageOptions },
  { path: '/service', component: PageService },
]
