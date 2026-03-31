<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminHeader from './components/layout/AdminHeader.vue'
import AdminSidebar from './components/layout/AdminSidebar.vue'

const route = useRoute()
const showShell = computed(() => !route.meta?.bare)
</script>

<template>
  <div class="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
    <template v-if="showShell">
      <AdminHeader />
      <div class="mx-auto flex w-full max-w-7xl gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <AdminSidebar />
        <main class="min-w-0 flex-1">
          <router-view />
        </main>
      </div>
    </template>

    <main
      v-else
      class="mx-auto w-full max-w-md px-4 py-16 sm:px-6"
    >
      <router-view />
    </main>
  </div>
</template>
