<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { csrf, login, me, logout } from '../utils/api/auth'
import { useAuthStore } from '../utils/stores/authStore'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = reactive({
  email: 'admin@test.com',
  password: '123456',
})

const loading = ref(false)
const error = ref('')

const submit = async () => {
  loading.value = true
  error.value = ''

  try {
    await csrf()
    await login(form)
    const user = await me()

    if (user?.role !== 'admin') {
      await logout()
      error.value = 'Your account does not have admin access.'

      return
    }

    auth.setUser(user)
    router.push(route.query.next || '/dashboard')
  } catch (e) {
    const message =
      e?._data?.message ||
      e?.data?.message ||
      'Login failed. Please check your credentials.'
    error.value = message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-2)] p-6 shadow-soft">
    <h1 class="mb-1 text-2xl font-semibold">
      Admin Login
    </h1>
    <p class="mb-6 text-sm text-[color:var(--muted)]">
      Sign in with your admin account.
    </p>

    <form
      class="space-y-4"
      @submit.prevent="submit"
    >
      <label class="block">
        <span class="mb-1 block text-sm">Email</span>
        <input
          v-model="form.email"
          type="email"
          required
          autocomplete="username"
          class="w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2"
        >
      </label>

      <label class="block">
        <span class="mb-1 block text-sm">Password</span>
        <input
          v-model="form.password"
          type="password"
          required
          autocomplete="current-password"
          class="w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2"
        >
      </label>

      <label class="flex items-center gap-2 text-sm text-[color:var(--muted)]">
        <input
          v-model="form.remember"
          type="checkbox"
        >
        Remember me
      </label>

      <p
        v-if="error"
        class="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-500"
      >
        {{ error }}
      </p>

      <button
        :disabled="loading"
        class="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
      >
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>
  </section>
</template>
