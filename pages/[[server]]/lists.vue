<script lang="ts" setup>
const { t } = useI18n()

const { client } = $(useMasto())
const paginator = client.v1.lists.list()

useHeadFixed({
  title: () => t('nav.lists'),
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>{{ t('nav.lists') }}</span>
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
