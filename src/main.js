import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './utils/router'
import { useAuthStore } from './utils/stores/authStore'
import { initTheme } from './utils/theme'
import { me } from './utils/api/auth'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

initTheme()

const auth = useAuthStore(pinia)

const initAuth = async () => {
  try {
    const user = await me()
    if (user?.role === 'admin') {
      auth.setUser(user)

      return
    }
  } catch {
  }

  auth.logout()
}

initAuth()

app.mount('#app')
