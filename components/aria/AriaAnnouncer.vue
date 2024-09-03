<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n'
import type { AriaAnnounceType, AriaLive } from '~/composables/aria'

const router = useRouter()
const { t, locale, locales } = useI18n()
const { ariaAnnouncer, announce } = useAriaAnnouncer()

const localeMap = (locales.value as LocaleObject[]).reduce((acc, l) => {
  acc[l.code!] = l.name!
  return acc
}, {} as Record<string, string>)

const ariaLive = ref<AriaLive>('polite')
const ariaMessage = ref<string>('')

function onMessage(event: AriaAnnounceType, message?: string) {
  if (event === 'announce')
    ariaMessage.value = message!
  else if (event === 'mute')
    ariaLive.value = 'off'
  else
    ariaLive.value = 'polite'
}

watch(locale, (l, ol) => {
  if (ol) {
    announce(t('a11y.locale_changing', [localeMap[ol] ?? ol]))
    setTimeout(() => {
      announce(t('a11y.locale_changed', [localeMap[l] ?? l]))
    }, 1000)
  }
}, { immediate: true })

onMounted(() => {
  ariaAnnouncer.on(onMessage)
  router.beforeEach(() => {
    announce(t('a11y.loading_page'))
  })
  router.afterEach((to, from) => {
    if (from) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          const title = document.title.trim().split('|')
          announce(t('a11y.route_loaded', [title[0]]))
        })
      }, 512)
    }
  })
})
</script>

<template>
  <p sr-only role="status" :aria-live="ariaLive">
    {{ ariaMessage }}
  </p>
</template>
