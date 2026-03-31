<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '../../utils/api/auth'
import { useAuthStore } from '../../utils/stores/authStore'
import { setTheme, theme } from '../../utils/theme'

const router = useRouter()
const auth = useAuthStore()
const userName = computed(() => auth.user?.name || auth.user?.email || 'Admin')

const signOut = async () => {
  try {
    await logout()
  } catch {
    // no-op: local state is still cleared
  }
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-[color:var(--border)] bg-[color:var(--header-bg)] backdrop-blur">
    <div class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div>
        <p class="text-sm font-semibold tracking-wide">
          Domain Admin Panel
        </p>
        <p class="text-xs text-[color:var(--muted-2)]">
          Welcome, {{ userName }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <select
          :value="theme"
          class="rounded-lg border border-[color:var(--border)] bg-[color:var(--panel-2)] px-2 py-1 text-sm"
          @change="setTheme($event.target.value)"
        >
          <option value="system">
            System
          </option>
          <option value="light">
            Light
          </option>
          <option value="dark">
            Dark
          </option>
        </select>
        <button
          class="rounded-lg border border-red-400/60 px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
          @click="signOut"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>
