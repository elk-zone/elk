<script setup lang="ts">
import type { CommonRouteTabOption } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const { t } = useI18n()

const list = computed(() => route.params.list as string)
const server = computed(() => (route.params.server ?? currentServer.value) as string)

const tabs = computed<CommonRouteTabOption[]>(() => [
  {
    to: {
      name: 'list',
      params: { server: server.value, list: list.value },
    },
    display: t('tab.posts'),
    icon: 'i-ri:list-unordered',
  },
  {
    to: {
      name: 'list-accounts',
      params: { server: server.value, list: list.value },
    },
    display: t('tab.accounts'),
    icon: 'i-ri:user-line',
  },
],
)

const { client } = useMasto()
const { data: listInfo, refresh } = await useAsyncData(() => client.value.v1.lists.$select(list.value).fetch(), { default: () => shallowRef() })

if (listInfo) {
  useHydratedHead({
    title: () => `${listInfo.value.title} | ${route.fullPath.endsWith('/accounts') ? t('tab.accounts') : t('tab.posts')} | ${t('nav.lists')}`,
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
