<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const server = $(computedEager(() => route.params.server as string))
const account = $(computedEager(() => route.params.account as string))

const tabs = $computed(() => [
  {
    name: 'account-index',
    to: {
      name: 'account-index',
      params: { server, account },
    },
    display: t('tab.posts'),
    icon: 'i-ri:file-list-2-line',
  },
  {
    name: 'account-replies',
    to: {
      name: 'account-replies',
      params: { server, account },
    },
    display: t('tab.posts_with_replies'),
    icon: 'i-ri:chat-3-line',
  },
  {
    name: 'account-media',
    to: {
      name: 'account-media',
      params: { server, account },
    },
    display: t('tab.media'),
    icon: 'i-ri:camera-2-line',
  },
] as const)
</script>

<template>
  <CommonRouteTabs force replace :options="tabs" prevent-scroll-top command border="base b" />
</template>
