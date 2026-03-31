<script setup>
import { computed, onMounted, ref } from 'vue'
import { getDashboard, getDomains, getSettings, getUsers } from '../utils/api/admin'

const loading = ref(true)
const data = ref(null)
const error = ref('')
const apiHealth = ref([])

const endpointChecks = [
  { label: 'Dashboard API', run: () => getDashboard() },
  { label: 'Users API', run: () => getUsers(1) },
  { label: 'Domains API', run: () => getDomains(1) },
  { label: 'Settings API', run: () => getSettings() },
]

const metricCards = computed(() => [
  { label: 'Total Users', value: Number(data.value?.users || 0) },
  { label: 'Domains', value: Number(data.value?.domains || 0) },
  { label: 'Paid Orders', value: Number(data.value?.orders?.paid || 0) },
  { label: 'Revenue', value: `$${Number(data.value?.revenue || 0).toFixed(2)}` },
])

const chartPoints = computed(() => {
  const series = Array.isArray(data.value?.trend) ? data.value.trend : []
  if (!series.length) {
    const base = Number(data.value?.revenue || 0)
    const fallback = [0.55, 0.7, 0.62, 0.8, 0.73, 0.9, 1]

    return fallback.map((item, index) => ({
      label: `W${index + 1}`,
      value: Number((base * item).toFixed(0)),
    }))
  }

  return series.map((item, index) => ({
    label: item.label || `M${index + 1}`,
    value: Number(item.value || 0),
  }))
})

const maxChartValue = computed(() => {
  const values = chartPoints.value.map(item => item.value)

  return Math.max(...values, 1)
})

const paidPercent = computed(() => {
  const paid = Number(data.value?.orders?.paid || 0)
  const pending = Number(data.value?.orders?.pending || 0)
  const total = paid + pending

  if (!total) return 0

  return Math.round((paid / total) * 100)
})

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    data.value = await getDashboard()
    const checks = await Promise.allSettled(endpointChecks.map(item => item.run()))
    apiHealth.value = checks.map((result, index) => ({
      name: endpointChecks[index].label,
      ok: result.status === 'fulfilled',
    }))
  } catch {
    error.value = 'Unable to load dashboard stats.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="space-y-6">
    <header class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-soft">
      <p class="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted-2)]">
        Overview
      </p>
      <h1 class="mt-1 text-2xl font-semibold">
        Dashboard
      </h1>
      <p class="mt-2 text-sm text-[color:var(--muted)]">
        Real-time snapshots from your admin services, users, and sales performance.
      </p>
    </header>

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
      class="space-y-6"
    >
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="card in metricCards"
          :key="card.label"
          class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 shadow-soft"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted-2)]">
            {{ card.label }}
          </p>
          <p class="mt-2 text-2xl font-semibold">
            {{ card.value }}
          </p>
        </article>
      </div>

      <div class="grid gap-4 xl:grid-cols-3">
        <article class="xl:col-span-2 rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-5 shadow-soft">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-[color:var(--muted-2)]">
            Revenue Trend
          </h2>
          <div class="mt-4 flex h-52 items-end gap-2">
            <div
              v-for="point in chartPoints"
              :key="point.label"
              class="group flex flex-1 flex-col items-center gap-2"
            >
              <div
                class="w-full rounded-t-xl bg-gradient-to-t from-indigo-600 to-cyan-500/90 transition group-hover:opacity-90"
                :style="{ height: `${Math.max((point.value / maxChartValue) * 100, 8)}%` }"
              />
              <span class="text-xs text-[color:var(--muted)]">{{ point.label }}</span>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-5 shadow-soft">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-[color:var(--muted-2)]">
            Order Completion
          </h2>
          <div class="mt-4 flex items-center justify-center">
            <div
              class="grid h-36 w-36 place-items-center rounded-full"
              :style="{
                background: `conic-gradient(rgb(99 102 241) ${paidPercent}%, var(--chip-bg) 0)`,
              }"
            >
              <div class="grid h-24 w-24 place-items-center rounded-full bg-[color:var(--panel)]">
                <span class="text-xl font-semibold">{{ paidPercent }}%</span>
              </div>
            </div>
          </div>
          <p class="mt-4 text-center text-sm text-[color:var(--muted)]">
            Paid {{ data.orders?.paid || 0 }} of {{ (data.orders?.paid || 0) + (data.orders?.pending || 0) }} orders
          </p>
        </article>
      </div>

      <article class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-5 shadow-soft">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-[color:var(--muted-2)]">
          Backend API Health
        </h2>
        <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="item in apiHealth"
            :key="item.name"
            class="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-2)] p-3"
          >
            <p class="text-xs text-[color:var(--muted)]">
              {{ item.name }}
            </p>
            <p
              class="mt-1 text-sm font-semibold"
              :class="item.ok ? 'text-emerald-500' : 'text-red-500'"
            >
              {{ item.ok ? 'Connected' : 'Issue detected' }}
            </p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
