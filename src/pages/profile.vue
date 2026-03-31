<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../utils/stores/authStore'

const auth = useAuthStore()
const user = computed(() => auth.user || {})

const formatDate = value => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleString()
}

const profileRows = computed(() => [
  { label: 'Name', value: user.value.name || '-' },
  { label: 'Email', value: user.value.email || '-' },
  { label: 'Role', value: user.value.role || 'admin' },
  { label: 'Email Verified', value: user.value.email_verified_at ? 'Yes' : 'No' },
  { label: 'Created', value: formatDate(user.value.created_at) },
  { label: 'Updated', value: formatDate(user.value.updated_at) },
])
</script>

<template>
  <section class="space-y-6">
    <header class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-soft">
      <p class="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted-2)]">
        Account
      </p>
      <h1 class="mt-1 text-2xl font-semibold">
        Admin Profile
      </h1>
      <p class="mt-2 text-sm text-[color:var(--muted)]">
        Review your account details and verify your admin access context.
      </p>
    </header>

    <div class="grid gap-6 lg:grid-cols-3">
      <article class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-soft">
        <div class="mb-4 flex items-center gap-4">
          <div class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-lg font-bold text-white">
            {{ (user.name || user.email || 'A').slice(0, 1).toUpperCase() }}
          </div>
          <div>
            <p class="text-base font-semibold">
              {{ user.name || 'Admin User' }}
            </p>
            <p class="text-sm text-[color:var(--muted)]">
              {{ user.email || '-' }}
            </p>
          </div>
        </div>
        <p class="inline-flex rounded-full bg-[color:var(--chip-bg)] px-3 py-1 text-xs font-semibold text-[color:var(--chip-text)]">
          {{ user.role || 'admin' }}
        </p>
      </article>

      <article class="lg:col-span-2 rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-soft">
        <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-[color:var(--muted-2)]">
          User Metadata
        </h2>
        <dl class="grid gap-3 sm:grid-cols-2">
          <div
            v-for="row in profileRows"
            :key="row.label"
            class="rounded-2xl bg-[color:var(--chip-bg)] p-3"
          >
            <dt class="text-xs text-[color:var(--muted-2)]">
              {{ row.label }}
            </dt>
            <dd class="mt-1 text-sm font-medium">
              {{ row.value }}
            </dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
</template>
