<script setup lang="ts">
import type { AriaAnnounceType, AriaLive } from '~/composables/aria/types'
import { useAriaAnnouncer } from '~/composables/aria'

const router = useRouter()
const { t } = useI18n()
const { ariaAnnouncer, announce } = useAriaAnnouncer()

let ariaLive = $ref<AriaLive>('polite')
let ariaMessage = $ref<string>('')

const onMessage = (event: AriaAnnounceType, message?: string) => {
  if (event === 'announce')
    ariaMessage = message!
  else if (event === 'mute')
    ariaLive = 'off'
  else
    ariaLive = 'polite'
}

onMounted(() => {
  ariaAnnouncer.on(onMessage)
  router.beforeEach(() => {
    announce(t('a11y.loading_page'))
  })
  router.afterEach((to, from) => {
    from && setTimeout(() => {
      requestAnimationFrame(() => {
        const title = document.title.trim().split('|')
        announce(t('a11y.route_loaded', [title[0]]))
      })
    }, 512)
  })
})
</script>

<template>
  <p sr-only role="status" :aria-live="ariaLive">
    {{ ariaMessage }}
  </p>
</template>
