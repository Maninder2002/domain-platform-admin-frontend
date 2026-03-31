<script setup>
const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/domains', label: 'Domains' },
  { to: '/extensions', label: 'Extensions' },
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
  { to: '/pages', label: 'Pages' },
]
</script>

<template>
  <aside class="hidden w-64 shrink-0 md:block">
    <div class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 shadow-soft">
      <div class="mb-4 rounded-2xl bg-[color:var(--chip-bg)] p-3">
        <p class="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted-2)]">
          Admin Workspace
        </p>
        <p class="mt-1 text-sm font-semibold">
          Control Center
        </p>
      </div>
      <nav class="space-y-1">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="block rounded-xl px-3 py-2.5 text-sm text-[color:var(--muted)] transition hover:bg-[color:var(--chip-bg)] hover:text-[color:var(--fg)]"
          active-class="bg-[color:var(--chip-bg)] font-semibold text-[color:var(--fg)] ring-1 ring-[color:var(--ring)]"
        >
          {{ link.label }}
        </router-link>
      </nav>
    </div>
  </aside>
</template>
