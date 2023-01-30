<script lang="ts" setup>
const { t } = useI18n()

const paginator = useMastoClient().v1.lists.list()

useHeadFixed({
  title: () => t('nav.lists'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/lists" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:list-check />
        <span text-lg font-bold>{{ t('nav.lists') }}</span>
      </NuxtLink>
    </template>
    <slot>
      <CommonPaginator :paginator="paginator">
        <template #default="{ item }">
          <NuxtLink :to="`list/${item.id}`" block p4 hover:bg-active flex justify-between>
            {{ item.title }}
          </NuxtLink>
        </template>
      </CommonPaginator>
    </slot>
  </MainContent>
</template>
