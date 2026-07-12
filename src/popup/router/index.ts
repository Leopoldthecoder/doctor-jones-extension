import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'

// Hash history: the popup is served from a chrome-extension:// URL, so there is
// no server to honor HTML5 history paths.
export default createRouter({
  history: createWebHashHistory(),
  routes,
})
