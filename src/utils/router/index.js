import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

const getUser = () => {
  try {
    const raw = localStorage.getItem('userData')
    if (!raw) return null

    return JSON.parse(raw)
  } catch {
    return null
  }
}

router.beforeEach(to => {
  const user = getUser()
  const loggedIn = !!user
  const isAdmin = user?.role === 'admin'

  if (to.meta?.requiresAuth && !loggedIn) {
    return { path: '/login', query: { next: to.fullPath } }
  }

  if (to.meta?.requiresAdmin && !isAdmin) {
    return { path: '/not-authorized' }
  }

  if (to.meta?.guestOnly && loggedIn && isAdmin) {
    return { path: '/dashboard' }
  }

  return true
})

export default router
