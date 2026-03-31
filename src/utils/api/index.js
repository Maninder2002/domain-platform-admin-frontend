import { ofetch } from 'ofetch'
import router from '../router'
import { useAuthStore } from '../stores/authStore'

const getCsrfToken = () =>
  document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1]

const clearSession = () => {
  localStorage.removeItem('userData')
  const auth = useAuthStore()
  auth.logout()
}

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include',

  async onRequest({ options }) {
    options.headers = {
      ...options.headers,
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
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
