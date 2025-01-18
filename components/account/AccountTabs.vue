<script setup lang="ts">
import type { CommonRouteTabOption } from '~/types'

const { t } = useI18n()
const route = useRoute()

const server = computed(() => route.params.server as string)
const account = computed(() => route.params.account as string)

const tabs = computed<CommonRouteTabOption[]>(() => [
  {
    name: 'account-index',
    to: {
      name: 'account-index',
      params: { server: server.value, account: account.value },
    },
    display: t('tab.posts'),
    icon: 'i-ri:file-list-2-line',
  },
  {
    name: 'account-replies',
    to: {
      name: 'account-replies',
      params: { server: server.value, account: account.value },
    },
    display: t('tab.posts_with_replies'),
    icon: 'i-ri:chat-1-line',
  },
  {
    name: 'account-media',
    to: {
      name: 'account-media',
      params: { server: server.value, account: account.value },
    },
    display: t('tab.media'),
    icon: 'i-ri:camera-2-line',
  },
])
</script>

<template>
  <CommonRouteTabs force replace :options="tabs" prevent-scroll-top command border="base b" />
</template>
