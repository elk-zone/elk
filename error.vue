<script setup lang="ts">
import type { NuxtError } from '#app'

definePageMeta({
  layout: 'default',
})

usePageHeader()

const route = useRoute()

// add more custom status codes messages here
const errorCodes: Record<number, string> = {
  404: 'Oops! Page not found',
  500: 'Oops! Something went wrong',
}

// prevent reactive update when clearing error
const error = shallowRef<string | Error | Partial<NuxtError> | undefined>(useError().value as any)
const statusCode = $computed(() => {
  const e = error.value
  return e && !(typeof e === 'string') && 'statusCode' in e ? e.statusCode : -1
})
const is404 = $computed(() => statusCode === 404)
const is500 = $computed(() => statusCode === 500)
const errorLayout = $computed(() => {
  const e = error.value
  if (e && isNuxtError(e) && e.data)
    return e.data.layout ?? 'default'

  return 'default'
})
const errorMessage = $computed(() => {
  const e = error.value
  if (!e)
    return undefined

  if (is500 && !isNuxtError(e))
    return errorCodes[500]

  if (typeof e === 'string')
    return e

  if ('message' in e)
    return e.message

  return errorCodes[statusCode ?? 500] ?? errorCodes[500]
})
const message = $computed(() => is404 ? errorCodes[404] : errorMessage)
const hideRetryBtn = $computed(() => {
  const e = error.value
  if (!e)
    return false

  if (isNuxtError(e))
    return e.data?.noRetry === true

  return false
})
const updateLayout = (layout = 'default') => {
  if (route.meta.layout !== layout)
    route.meta.layout = layout as any
}
const retry = () => {
  clearError({ redirect: currentUser.value ? '/home' : '/public' })
}

onMounted(() => {
  updateLayout(errorLayout)
})
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
