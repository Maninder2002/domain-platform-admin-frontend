<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getSettings, saveSetting } from '../utils/api/admin'

const loading = ref(true)
const saving = ref(false)
const saved = ref('')
const error = ref('')

const form = reactive({
  payment: {
    mode: 'fake',
    razorpay_key: '',
    razorpay_secret: '',
  },
  reseller: {
    mode: 'fake',
    api_key: '',
    api_secret: '',
    base_url: '',
  },
})

const modeOptions = [
  { value: 'fake', label: 'Fake', hint: 'Local / dev' },
  { value: 'test', label: 'Test', hint: 'Sandbox' },
  { value: 'live', label: 'Live', hint: 'Production' },
]

const applyFromResponse = data => {
  if (!data || typeof data !== 'object') return

  if (data.payment) {
    form.payment.mode = data.payment.mode ?? 'fake'
    form.payment.razorpay_key = data.payment.razorpay_key ?? ''
    form.payment.razorpay_secret = data.payment.razorpay_secret ?? ''
  }

  if (data.reseller) {
    form.reseller.mode = data.reseller.mode ?? 'fake'
    form.reseller.api_key = data.reseller.api_key ?? ''
    form.reseller.api_secret = data.reseller.api_secret ?? ''
    form.reseller.base_url = data.reseller.base_url ?? ''
  }
}

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await getSettings()
    applyFromResponse(data)
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
    await saveSetting({
      payment: { ...form.payment },
      reseller: { ...form.reseller },
    })
    saved.value = 'Settings saved.'
    await load()
  } catch (e) {
    error.value = e?._data?.message || 'Unable to save settings.'
  } finally {
    saving.value = false
  }
}

const inputClass =
  'w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-2)] px-3 py-2.5 text-sm text-[color:var(--fg)] transition placeholder:text-[color:var(--muted-2)] focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] dark:bg-[color:var(--panel)]'

onMounted(load)
</script>

<template>
  <section class="space-y-6">
    <header class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-soft">
      <p class="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted-2)]">
        Configuration
      </p>
      <h1 class="mt-1 text-2xl font-semibold">
        Settings
      </h1>
      <p class="mt-2 max-w-2xl text-sm text-[color:var(--muted)]">
        Control payment and reseller modes. Secrets are stored on the server; save again only when you need to rotate credentials.
      </p>
    </header>

    <p
      v-if="saved"
      class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400"
    >
      {{ saved }}
    </p>
    <p
      v-if="error"
      class="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-500"
    >
      {{ error }}
    </p>

    <p
      v-if="loading"
      class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] px-6 py-10 text-center text-sm text-[color:var(--muted)] shadow-soft"
    >
      Loading settings…
    </p>

    <form
      v-else
      class="space-y-6"
      @submit.prevent="submit"
    >
      <div class="grid gap-6 xl:grid-cols-2">
        <article class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-soft">
          <div class="mb-6 flex items-start justify-between gap-4 border-b border-[color:var(--border)] pb-5">
            <div>
              <h2 class="text-lg font-semibold">
                Payment
              </h2>
              <p class="mt-1 text-sm text-[color:var(--muted)]">
                Razorpay credentials apply when mode is not Fake.
              </p>
            </div>
            <span class="shrink-0 rounded-full border border-[color:var(--border)] bg-[color:var(--chip-bg)] px-3 py-1 text-xs font-medium text-[color:var(--chip-text)]">
              Gateway
            </span>
          </div>

          <div class="space-y-5">
            <div>
              <span class="mb-2 block text-sm font-medium text-[color:var(--fg)]">Environment</span>
              <div
                class="grid grid-cols-3 gap-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--chip-bg)] p-1"
                role="group"
                aria-label="Payment mode"
              >
                <button
                  v-for="opt in modeOptions"
                  :key="`pay-${opt.value}`"
                  type="button"
                  class="rounded-xl px-2 py-2.5 text-center text-sm font-medium transition"
                  :class="
                    form.payment.mode === opt.value
                      ? 'bg-[color:var(--panel-2)] text-[color:var(--fg)] shadow-soft ring-1 ring-[color:var(--border)] dark:bg-[color:var(--panel)]'
                      : 'text-[color:var(--muted)] hover:text-[color:var(--fg)]'
                  "
                  @click="form.payment.mode = opt.value"
                >
                  <span class="block">{{ opt.label }}</span>
                  <span class="mt-0.5 block text-[10px] font-normal uppercase tracking-wide text-[color:var(--muted-2)]">
                    {{ opt.hint }}
                  </span>
                </button>
              </div>
            </div>

            <label class="block">
              <span class="mb-2 block text-sm font-medium text-[color:var(--fg)]">Razorpay key</span>
              <input
                v-model="form.payment.razorpay_key"
                type="text"
                autocomplete="off"
                :class="inputClass"
              >
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-medium text-[color:var(--fg)]">Razorpay secret</span>
              <input
                v-model="form.payment.razorpay_secret"
                type="password"
                autocomplete="new-password"
                :class="inputClass"
              >
            </label>
          </div>
        </article>

        <article class="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-soft">
          <div class="mb-6 flex items-start justify-between gap-4 border-b border-[color:var(--border)] pb-5">
            <div>
              <h2 class="text-lg font-semibold">
                Reseller
              </h2>
              <p class="mt-1 text-sm text-[color:var(--muted)]">
                API connection for domain provisioning integrations.
              </p>
            </div>
            <span class="shrink-0 rounded-full border border-[color:var(--border)] bg-[color:var(--chip-bg)] px-3 py-1 text-xs font-medium text-[color:var(--chip-text)]">
              Provider
            </span>
          </div>

          <div class="space-y-5">
            <div>
              <span class="mb-2 block text-sm font-medium text-[color:var(--fg)]">Environment</span>
              <div
                class="grid grid-cols-3 gap-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--chip-bg)] p-1"
                role="group"
                aria-label="Reseller mode"
              >
                <button
                  v-for="opt in modeOptions"
                  :key="`res-${opt.value}`"
                  type="button"
                  class="rounded-xl px-2 py-2.5 text-center text-sm font-medium transition"
                  :class="
                    form.reseller.mode === opt.value
                      ? 'bg-[color:var(--panel-2)] text-[color:var(--fg)] shadow-soft ring-1 ring-[color:var(--border)] dark:bg-[color:var(--panel)]'
                      : 'text-[color:var(--muted)] hover:text-[color:var(--fg)]'
                  "
                  @click="form.reseller.mode = opt.value"
                >
                  <span class="block">{{ opt.label }}</span>
                  <span class="mt-0.5 block text-[10px] font-normal uppercase tracking-wide text-[color:var(--muted-2)]">
                    {{ opt.hint }}
                  </span>
                </button>
              </div>
            </div>

            <label class="block">
              <span class="mb-2 block text-sm font-medium text-[color:var(--fg)]">API key</span>
              <input
                v-model="form.reseller.api_key"
                type="text"
                autocomplete="off"
                :class="inputClass"
              >
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-medium text-[color:var(--fg)]">API secret</span>
              <input
                v-model="form.reseller.api_secret"
                type="password"
                autocomplete="new-password"
                :class="inputClass"
              >
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-medium text-[color:var(--fg)]">Base URL</span>
              <input
                v-model="form.reseller.base_url"
                type="text"
                autocomplete="off"
                placeholder="https://api.example.com"
                :class="inputClass"
              >
            </label>
          </div>
        </article>
      </div>

      <footer class="flex flex-col gap-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-[color:var(--muted)]">
          Changes apply immediately after a successful save.
        </p>
        <button
          type="submit"
          :disabled="saving"
          class="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-55 dark:from-indigo-500 dark:to-cyan-500"
        >
          {{ saving ? 'Saving…' : 'Save settings' }}
        </button>
      </footer>
    </form>
  </section>
</template>
