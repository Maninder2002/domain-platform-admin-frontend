<script setup>
import { onMounted, reactive, ref } from 'vue'
import {
  createExtension,
  deleteExtension,
  getExtensions,
  updateExtension,
} from '../utils/api/admin'

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const extensions = ref([])

const form = reactive({
  extension: '',
  price: '',
  renewal_price: '',
  is_active: true,
})

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    extensions.value = await getExtensions()
  } catch {
    error.value = 'Unable to load extensions.'
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  saving.value = true
  error.value = ''
  try {
    await createExtension({
      ...form,
      price: Number(form.price),
      renewal_price: Number(form.renewal_price),
    })
    form.extension = ''
    form.price = ''
    form.renewal_price = ''
    form.is_active = true
    await load()
  } catch (e) {
    error.value = e?._data?.message || 'Unable to create extension.'
  } finally {
    saving.value = false
  }
}

const toggle = async item => {
  await updateExtension(item.id, { is_active: !item.is_active })
  await load()
}

const remove = async item => {
  await deleteExtension(item.id)
  await load()
}

onMounted(load)
</script>

<template>
  <section>
    <h1 class="mb-4 text-2xl font-semibold">
      Domain Extensions
    </h1>

    <p
      v-if="error"
      class="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-500"
    >
      {{ error }}
    </p>

    <form
      class="mb-6 grid gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 shadow-soft md:grid-cols-4"
      @submit.prevent="submit"
    >
      <input
        v-model="form.extension"
        placeholder=".com"
        required
        class="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-sm"
      >
      <input
        v-model="form.price"
        placeholder="Price"
        type="number"
        min="0"
        step="0.01"
        required
        class="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-sm"
      >
      <input
        v-model="form.renewal_price"
        placeholder="Renewal Price"
        type="number"
        min="0"
        step="0.01"
        required
        class="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-sm"
      >
      <button
        :disabled="saving"
        class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
      >
        {{ saving ? 'Saving...' : 'Add Extension' }}
      </button>
    </form>

    <div class="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] shadow-soft">
      <table class="min-w-full text-sm">
        <thead class="bg-[color:var(--chip-bg)] text-left">
          <tr>
            <th class="px-4 py-3 font-semibold">
              Extension
            </th>
            <th class="px-4 py-3 font-semibold">
              Price
            </th>
            <th class="px-4 py-3 font-semibold">
              Renewal
            </th>
            <th class="px-4 py-3 font-semibold">
              Active
            </th>
            <th class="px-4 py-3 font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <tr
            v-for="item in extensions"
            :key="item.id"
            class="border-t border-[color:var(--border)]"
          >
            <td class="px-4 py-3">
              {{ item.extension }}
            </td>
            <td class="px-4 py-3">
              ${{ Number(item.price).toFixed(2) }}
            </td>
            <td class="px-4 py-3">
              ${{ Number(item.renewal_price).toFixed(2) }}
            </td>
            <td class="px-4 py-3">
              {{ item.is_active ? 'Yes' : 'No' }}
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button
                  class="rounded border border-[color:var(--border)] px-2 py-1 text-xs"
                  @click="toggle(item)"
                >
                  Toggle
                </button>
                <button
                  class="rounded border border-red-500/40 px-2 py-1 text-xs text-red-500"
                  @click="remove(item)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p
        v-if="loading"
        class="px-4 py-4 text-sm text-[color:var(--muted)]"
      >
        Loading extensions...
      </p>
    </div>
  </section>
</template>
