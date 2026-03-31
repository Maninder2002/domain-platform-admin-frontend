<script setup>
import { reactive, ref } from 'vue'
import { getPage, updatePage } from '../utils/api/admin'

const loading = ref(false)
const saving = ref(false)
const message = ref('')
const error = ref('')

const state = reactive({
  slug: 'home',
  title: '',
  sections: [
    { type: 'hero', content: '' },
  ],
})

const load = async () => {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    const page = await getPage(state.slug)
    state.title = page.title || ''
    state.sections = (page.sections || []).map(item => ({
      type: item.type,
      content: item.content,
    }))
    if (!state.sections.length) {
      state.sections = [{ type: 'hero', content: '' }]
    }
  } catch {
    error.value = 'Page not found yet. You can create it using save.'
  } finally {
    loading.value = false
  }
}

const addSection = () => {
  state.sections.push({ type: 'text', content: '' })
}

const removeSection = index => {
  state.sections.splice(index, 1)
  if (!state.sections.length) addSection()
}

const save = async () => {
  saving.value = true
  message.value = ''
  error.value = ''
  try {
    await updatePage(state.slug, {
      title: state.title || state.slug,
      sections: state.sections,
    })
    message.value = 'Page updated successfully.'
  } catch (e) {
    error.value = e?._data?.message || 'Unable to update page.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section>
    <h1 class="mb-4 text-2xl font-semibold">
      Pages
    </h1>

    <div class="mb-4 flex flex-wrap items-center gap-2">
      <input
        v-model="state.slug"
        class="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-sm"
        placeholder="page slug"
      >
      <button
        class="rounded-lg border border-[color:var(--border)] px-3 py-2 text-sm"
        :disabled="loading"
        @click="load"
      >
        {{ loading ? 'Loading...' : 'Load Page' }}
      </button>
    </div>

    <label class="mb-4 block">
      <span class="mb-1 block text-sm">Title</span>
      <input
        v-model="state.title"
        class="w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-sm"
      >
    </label>

    <div class="space-y-3">
      <div
        v-for="(section, index) in state.sections"
        :key="index"
        class="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 shadow-soft"
      >
        <div class="mb-2 flex items-center justify-between">
          <input
            v-model="section.type"
            class="rounded border border-[color:var(--border)] bg-transparent px-2 py-1 text-sm"
            placeholder="type"
          >
          <button
            class="text-xs text-red-500"
            @click="removeSection(index)"
          >
            Remove
          </button>
        </div>
        <textarea
          v-model="section.content"
          rows="4"
          class="w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-sm"
          placeholder="section content"
        />
      </div>
    </div>

    <div class="mt-4 flex gap-2">
      <button
        class="rounded-lg border border-[color:var(--border)] px-3 py-2 text-sm"
        @click="addSection"
      >
        Add Section
      </button>
      <button
        :disabled="saving"
        class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
        @click="save"
      >
        {{ saving ? 'Saving...' : 'Save Page' }}
      </button>
    </div>

    <p
      v-if="message"
      class="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600"
    >
      {{ message }}
    </p>
    <p
      v-if="error"
      class="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-500"
    >
      {{ error }}
    </p>
  </section>
</template>
