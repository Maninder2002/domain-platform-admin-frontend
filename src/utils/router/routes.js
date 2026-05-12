import login from '../../pages/login.vue'
import dashboard from '../../pages/dashboard.vue'
import users from '../../pages/users.vue'
import domains from '../../pages/domains.vue'
import extensions from '../../pages/extensions.vue'
import settings from '../../pages/settings.vue'
import pages from '../../pages/pagesEditor.vue'
import profile from '../../pages/profile.vue'
import notAuthorized from '../../pages/notAuthorized.vue'
import notFound from '../../pages/notFound.vue'

const routes = [
  {
    path: '/',
    redirect: { path: '/login' },
  },
  {
    path: '/login',
    component: login,
    meta: { guestOnly: true, bare: true },
  },
  {
    path: '/dashboard',
    component: dashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/users',
    component: users,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/domains',
    component: domains,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/extensions',
    component: extensions,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/settings',
    component: settings,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/pages',
    component: pages,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/profile',
    component: profile,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/not-authorized',
    component: notAuthorized,
    meta: { bare: true },
  },
  {
    path: '/:pathMatch(.*)*',
    component: notFound,
    meta: { bare: true },
  },
]

export default routes
