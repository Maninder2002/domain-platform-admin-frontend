import { defineStore } from 'pinia'

export const useAuthStore = defineStore('Auth', {
  state: () => ({
    user: null,
    loggedIN: false,
  }),

  actions: {
    setUser(user) {
      this.user = user
      this.loggedIN = true
      localStorage.setItem('userData', JSON.stringify(user))
    },

    logout() {
      localStorage.removeItem('userData')
      this.$reset()
    },
  },

  persist: true,
})
