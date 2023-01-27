<script setup lang="ts">
import type { CommonRouteTabOption } from '~/components/common/CommonRouteTabs.vue'

const list = $computed(() => useRoute().params.list as string)
const server = $computed(() => useRoute().params.server as string)

const { t } = useI18n()

const tabs = $computed<CommonRouteTabOption[]>(() => [
  {
    to: {
      name: 'list',
      params: { server, list },
    },
    display: t('tab.list'),
    icon: 'i-ri:list-unordered',
  },
  {
    to: {
      name: 'list-accounts',
      params: { server, list },
    },
    display: t('tab.accounts'),
    icon: 'i-ri:user-line',
  },
],
)

const { client } = $(useMasto())
const { data: listInfo, refresh } = $(await useAsyncData(() => client.v1.lists.fetch(list), { default: () => shallowRef() }))

if (listInfo) {
  useHeadFixed({
    title: () => `${listInfo.title}`,
  })
}

onReactivated(() => {
  // Silently update data when reentering the page
  // The user will see the previous content first, and any changes will be updated to the UI when the request is completed
  refresh()
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>{{ listInfo ? listInfo.title : t('nav.list') }}</span>
    </template>
    <template #header>
      <CommonRouteTabs replace :options="tabs" />
    </template>
    <NuxtPage v-if="isHydrated" />
  </MainContent>
</template>
