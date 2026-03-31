import { computed, ref } from 'vue'

const STORAGE_KEY = 'theme'
const DEFAULT = 'system'

export const theme = ref(DEFAULT)

const readStoredTheme = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    // ignore
  }

  return DEFAULT
}

const systemPrefersDark = () => {
  if (typeof window === 'undefined') return false

  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false
}

export const resolvedTheme = computed(() => {
  if (theme.value === 'system') return systemPrefersDark() ? 'dark' : 'light'

  return theme.value
})

const applyThemeToDom = () => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', resolvedTheme.value === 'dark')
  root.dataset.theme = theme.value
}

export const setTheme = next => {
  if (next !== 'light' && next !== 'dark' && next !== 'system') return
  theme.value = next

  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // ignore
  }

  applyThemeToDom()
}

let mediaListenerAttached = false
export const initTheme = () => {
  theme.value = readStoredTheme()
  applyThemeToDom()

  if (mediaListenerAttached) return
  mediaListenerAttached = true

  const mql = window.matchMedia?.('(prefers-color-scheme: dark)')
  if (!mql?.addEventListener) return

  mql.addEventListener('change', () => {
    if (theme.value === 'system') applyThemeToDom()
  })
}
