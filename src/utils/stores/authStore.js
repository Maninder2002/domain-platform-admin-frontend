import { defineStore } from 'pinia'

const ADMIN_USER_STORAGE_KEY = 'adminUserData'

export const useAuthStore = defineStore('AdminAuth', {
  state: () => ({
    user: null,
    loggedIN: false,
  }),

  actions: {
    setUser(user) {
      this.user = user
      this.loggedIN = true
      localStorage.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify(user))
    },

    logout() {
      localStorage.removeItem(ADMIN_USER_STORAGE_KEY)
      localStorage.removeItem('userData')
      this.$reset()
    },
  },

  persist: {
    key: 'admin-auth-store',
  },
})
