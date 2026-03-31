<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { logout } from '../../utils/api/auth'
import { useAuthStore } from '../../utils/stores/authStore'
import { setTheme, theme } from '../../utils/theme'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const userName = computed(() => auth.user?.name || auth.user?.email || 'Admin')
const userRole = computed(() => auth.user?.role || 'admin')

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
      <div class="flex items-center gap-3">
        <div class="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-sm font-bold text-white shadow-soft">
          AP
        </div>
        <div>
          <p class="text-sm font-semibold tracking-wide">
            Domain Admin
          </p>
          <p class="text-xs text-[color:var(--muted-2)]">
            Welcome, {{ userName }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <RouterLink
          to="/profile"
          class="rounded-lg border border-[color:var(--border)] bg-[color:var(--panel-2)] px-3 py-1.5 text-sm transition hover:bg-[color:var(--chip-bg)]"
          :class="route.path === '/profile' ? 'ring-1 ring-[color:var(--ring)]' : ''"
        >
          {{ userRole }}
        </RouterLink>
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
