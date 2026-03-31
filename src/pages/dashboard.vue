<script setup>
import { onMounted, ref } from 'vue'
import { getDashboard } from '../utils/api/admin'

const loading = ref(true)
const data = ref(null)
const error = ref('')

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    data.value = await getDashboard()
  } catch {
    error.value = 'Unable to load dashboard stats.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section>
    <h1 class="mb-4 text-2xl font-semibold">
      Dashboard
    </h1>

    <p
      v-if="error"
      class="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-500"
    >
      {{ error }}
    </p>

    <p
      v-if="loading"
      class="text-sm text-[color:var(--muted)]"
    >
      Loading dashboard...
    </p>

    <div
      v-else-if="data"
      class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 shadow-soft">
        <p class="text-sm text-[color:var(--muted)]">
          Users
        </p>
        <p class="mt-2 text-2xl font-semibold">
          {{ data.users }}
        </p>
      </div>
      <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 shadow-soft">
        <p class="text-sm text-[color:var(--muted)]">
          Domains
        </p>
        <p class="mt-2 text-2xl font-semibold">
          {{ data.domains }}
        </p>
      </div>
      <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 shadow-soft">
        <p class="text-sm text-[color:var(--muted)]">
          Orders Paid
        </p>
        <p class="mt-2 text-2xl font-semibold">
          {{ data.orders?.paid }}
        </p>
      </div>
      <div class="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 shadow-soft">
        <p class="text-sm text-[color:var(--muted)]">
          Revenue
        </p>
        <p class="mt-2 text-2xl font-semibold">
          ${{ Number(data.revenue || 0).toFixed(2) }}
        </p>
      </div>
    </div>
  </section>
</template>
