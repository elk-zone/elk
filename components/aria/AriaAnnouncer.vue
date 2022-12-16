<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { AriaAnnounceType, AriaLive } from '~/composables/aria/types'
import { useAriaAnnouncer } from '~/composables/aria'
import type { LocaleObject } from '#i18n'

const router = useRouter()
const { t, locale, locales } = useI18n()
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

watch(locale, (ol, l) => {
  if (ol) {
    const ls = locales as ComputedRef<LocaleObject[]>
    const localName = ls.value.find(x => x.code === ol)?.name
    const toLocalName = ls.value.find(x => x.code === ol)?.name
    announce(t('a11y.locale_changing', [localName ?? ol]))
    setTimeout(() => {
      announce(t('a11y.locale_changed', [toLocalName ?? l]))
    }, 1000)
  }
}, { immediate: true })

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
