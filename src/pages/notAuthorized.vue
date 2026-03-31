<template>
  <section class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-2)] p-8 text-center shadow-soft">
    <h1 class="text-2xl font-semibold">
      Access denied
    </h1>
    <p class="mt-2 text-sm text-[color:var(--muted)]">
      This account does not have permission to access the admin panel.
    </p>
    <router-link
      class="mt-5 inline-block rounded-lg border border-[color:var(--border)] px-4 py-2 text-sm"
      to="/login"
    >
      Go to Login
    </router-link>
  </section>
</template>
