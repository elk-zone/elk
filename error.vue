<script setup lang="ts">
import type { NuxtError } from '#app'

// prevent reactive update when clearing error
const { error } = defineProps<{
  error?: string | Error | Partial<NuxtError>
}>()

usePageHeader()

// add more custom status codes messages here
const errorCodes: Record<number, string> = {
  404: 'Oops! Page not found',
  500: 'Oops! Something went wrong',
}

const statusCode = $computed(() => {
  return error && !(typeof error === 'string') && 'statusCode' in error ? error.statusCode : -1
})
const is404 = $computed(() => statusCode === 404)
const is500 = $computed(() => statusCode === 500)
const errorMessage = $computed(() => {
  if (!error)
    return undefined

  if (is500 && !isNuxtError(error))
    return errorCodes[500]

  if (typeof error === 'string')
    return error

  if ('message' in error)
    return error.message

  return errorCodes[statusCode ?? 500] ?? errorCodes[500]
})
const message = $computed(() => is404 ? errorCodes[404] : errorMessage)
const hideRetryBtn = $computed(() => {
  if (!error)
    return false

  if (isNuxtError(error))
    return error.data?.noRetry === true

  return false
})

const retry = () => {
  clearError({ redirect: currentUser.value ? '/home' : '/public' })
}
</script>

<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,var(--c-primary) 0%,var(--c-primary-active) 100%)" />
  <NuxtLayout>
    <MainContent>
      <template #title>
        <span text-lg font-bold>Error</span>
      </template>
      <slot>
        <div v-if="hideRetryBtn" p5 grid gap-y-4>
          <div text-lg>
            Something went wrong
          </div>
          <div text-secondary>
            {{ message }}
          </div>
        </div>
        <form v-else p5 grid gap-y-4>
          <div text-lg>
            Something went wrong
          </div>
          <div text-secondary>
            {{ message }}
          </div>
          <button v-if="!hideRetryBtn" type="button" class="btn-solid text-center" @click="retry">
            Retry
          </button>
        </form>
      </slot>
    </MainContent>
  </NuxtLayout>
</template>

<style>
html, body , #__nuxt{
  height: 100vh;
  margin: 0;
  padding: 0;
}
html.dark {
  color-scheme: dark;
}
html {
  --at-apply: bg-base text-base;
}
</style>
