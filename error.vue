<script setup lang="ts">
import type { NuxtError } from '#app'

// prevent reactive update when clearing error
const { error } = defineProps<{
  error: Partial<NuxtError>
}>()

// add more custom status codes messages here
const errorCodes: Record<number, string> = {
  404: 'Page not found',
}

if (import.meta.dev)
  console.error(error)

const defaultMessage = 'Something went wrong'

const message = error.message ?? errorCodes[error.statusCode!] ?? defaultMessage

const state = ref<'error' | 'reloading'>('error')
async function reload() {
  state.value = 'reloading'
  try {
    clearError({ redirect: currentUser.value ? '/home' : `/${currentServer.value}/public/local` })
  }
  catch (err) {
    console.error(err)
    state.value = 'error'
  }
}
</script>

<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,var(--c-primary) 0%,var(--c-primary-active) 100%)" />
  <NuxtLayout>
    <MainContent>
      <template #title>
        <span timeline-title-style>Error</span>
      </template>
      <slot>
        <form p5 grid gap-y-4 @submit="reload">
          <div text-lg>
            Something went wrong
          </div>
          <div text-secondary>
            {{ message }}
          </div>
          <button flex items-center gap-2 justify-center btn-solid text-center :disabled="state === 'reloading'">
            <span v-if="state === 'reloading'" block animate-spin preserve-3d>
              <span block i-ri:loader-2-fill />
            </span>
            {{ state === 'reloading' ? 'Reloading' : 'Reload' }}
          </button>
        </form>
      </slot>
    </MainContent>
  </NuxtLayout>
  <AriaAnnouncer />
</template>
