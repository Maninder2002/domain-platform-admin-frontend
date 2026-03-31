<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getSettings, saveSetting } from '../utils/api/admin'

const loading = ref(true)
const saving = ref(false)
const saved = ref('')
const error = ref('')
const settings = ref([])

const form = reactive({
  category: '',
  key: '',
  value: '',
})

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    settings.value = await getSettings()
  } catch {
    error.value = 'Unable to load settings.'
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  saving.value = true
  saved.value = ''
  error.value = ''
  try {
    await saveSetting(form)
    saved.value = 'Setting saved.'
    form.category = ''
    form.key = ''
    form.value = ''
    await load()
  } catch (e) {
    error.value = e?._data?.message || 'Unable to save setting.'
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <section>
    <h1 class="mb-4 text-2xl font-semibold">
      Settings
    </h1>

    <form
      class="mb-6 grid gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 shadow-soft md:grid-cols-4"
      @submit.prevent="submit"
    >
      <input
        v-model="form.category"
        placeholder="Category"
        required
        class="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-sm"
      >
      <input
        v-model="form.key"
        placeholder="Key"
        required
        class="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-sm"
      >
      <input
        v-model="form.value"
        placeholder="Value"
        class="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-sm"
      >
      <button
        :disabled="saving"
        class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
      >
        {{ saving ? 'Saving...' : 'Save' }}
      </button>
    </form>

    <p
      v-if="saved"
      class="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600"
    >
      {{ saved }}
    </p>
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
              Category
            </th>
            <th class="px-4 py-3 font-semibold">
              Key
            </th>
            <th class="px-4 py-3 font-semibold">
              Value
            </th>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <tr
            v-for="item in settings"
            :key="item.id"
            class="border-t border-[color:var(--border)]"
          >
            <td class="px-4 py-3">
              {{ item.category }}
            </td>
            <td class="px-4 py-3">
              {{ item.key }}
            </td>
            <td class="px-4 py-3">
              {{ item.value || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
      <p
        v-if="loading"
        class="px-4 py-4 text-sm text-[color:var(--muted)]"
      >
        Loading settings...
      </p>
    </div>
  </section>
</template>
