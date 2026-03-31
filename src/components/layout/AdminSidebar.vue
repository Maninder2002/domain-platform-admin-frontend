<script setup>
const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/domains', label: 'Domains' },
  { to: '/extensions', label: 'Extensions' },
  { to: '/settings', label: 'Settings' },
  { to: '/pages', label: 'Pages' },
]
</script>

<template>
  <aside class="hidden w-56 shrink-0 md:block">
    <div class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-3 shadow-soft">
      <nav class="space-y-1">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="block rounded-lg px-3 py-2 text-sm text-[color:var(--muted)] transition hover:bg-[color:var(--chip-bg)]"
          active-class="bg-[color:var(--chip-bg)] font-semibold text-[color:var(--fg)]"
        >
          {{ link.label }}
        </router-link>
      </nav>
    </div>
  </aside>
</template>
