<script setup>
import { onMounted, ref } from 'vue'
import { getDomains } from '../utils/api/admin'

const loading = ref(true)
const error = ref('')
const domains = ref([])
const page = ref(1)
const lastPage = ref(1)

const load = async nextPage => {
  loading.value = true
  error.value = ''
  try {
    const res = await getDomains(nextPage)
    domains.value = res.data || []
    page.value = res.current_page || 1
    lastPage.value = res.last_page || 1
  } catch {
    error.value = 'Unable to load domains.'
  } finally {
    loading.value = false
  }
}

onMounted(() => load(1))
</script>

<template>
  <section>
    <h1 class="mb-4 text-2xl font-semibold">
      Domains
    </h1>

    <p
      v-if="error"
      class="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-500"
    >
      {{ error }}
    </p>

    <div class="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] shadow-soft">
      <table class="min-w-full text-sm">
        <thead class="bg-[color:var(--chip-bg)] text-left">
          <tr>
            <th class="px-4 py-3 font-semibold">
              Domain
            </th>
            <th class="px-4 py-3 font-semibold">
              Owner
            </th>
            <th class="px-4 py-3 font-semibold">
              Expires At
            </th>
            <th class="px-4 py-3 font-semibold">
              Status
            </th>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <tr
            v-for="item in domains"
            :key="item.id"
            class="border-t border-[color:var(--border)]"
          >
            <td class="px-4 py-3">
              {{ item.domain_name || item.name || '-' }}
            </td>
            <td class="px-4 py-3">
              {{ item.user?.email || '-' }}
            </td>
            <td class="px-4 py-3">
              {{ item.expires_at || '-' }}
            </td>
            <td class="px-4 py-3">
              {{ item.status || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
      <p
        v-if="loading"
        class="px-4 py-4 text-sm text-[color:var(--muted)]"
      >
        Loading domains...
      </p>
    </div>

    <div class="mt-4 flex items-center gap-2">
      <button
        :disabled="page <= 1 || loading"
        class="rounded-lg border border-[color:var(--border)] px-3 py-1.5 text-sm disabled:opacity-50"
        @click="load(page - 1)"
      >
        Prev
      </button>
      <span class="text-sm text-[color:var(--muted)]">Page {{ page }} / {{ lastPage }}</span>
      <button
        :disabled="page >= lastPage || loading"
        class="rounded-lg border border-[color:var(--border)] px-3 py-1.5 text-sm disabled:opacity-50"
        @click="load(page + 1)"
      >
        Next
      </button>
    </div>
  </section>
</template>
