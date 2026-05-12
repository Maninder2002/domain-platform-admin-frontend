import { ofetch } from 'ofetch'
import router from '../router'
import { useAuthStore } from '../stores/authStore'

/** Admin SPA lives under `/admin/`; `/` baseURL turns `api/...` into `/admin/api/...`. Same-host API uses `origin`. */
const resolveApiBaseURL = () => {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (typeof raw === 'string' && /^https?:\/\//i.test(raw.trim())) {
    return raw.trim().replace(/\/+$/, '')
  }
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return ''
}

const getCsrfToken = () => {
  const row = document.cookie
    .split('; ')
    .find(r => r.startsWith('XSRF-TOKEN='))

  return row?.slice('XSRF-TOKEN='.length)
}

const clearSession = () => {
  localStorage.removeItem('adminUserData')
  localStorage.removeItem('userData')
  const auth = useAuthStore()
  auth.logout()
}

export const $api = ofetch.create({
  baseURL: resolveApiBaseURL(),
  credentials: 'include',

  async onRequest({ options }) {
    options.headers = {
      ...options.headers,
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Panel': 'admin',
    }

    const csrfToken = getCsrfToken()

    if (csrfToken) {
      options.headers = {
        ...options.headers,
        'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
      }
    }
  },

  async onResponse({ response }) {
    if (!response) return

    if (response.status === 401) {
      if (router.currentRoute.value.path === '/login') return
      clearSession()
      router.push('/login')
    }

    if (response.status === 403) {
      router.push('/not-authorized')
    }
  },
})
