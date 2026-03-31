<template>
  <section class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-2)] p-8 text-center shadow-soft">
    <h1 class="text-2xl font-semibold">
      Page not found
    </h1>
    <p class="mt-2 text-sm text-[color:var(--muted)]">
      The requested route does not exist.
    </p>
    <router-link
      class="mt-5 inline-block rounded-lg border border-[color:var(--border)] px-4 py-2 text-sm"
      to="/dashboard"
    >
      Back to Dashboard
    </router-link>
  </section>
</template>
