<script lang="ts" setup>
const { t } = useI18n()

const client = useMastoClient()

let paginator = client.v1.lists.list()

useHeadFixed({
  title: () => t('nav.lists'),
})

async function removeList(listId: string) {
  if (await openConfirmDialog({
    title: t('confirm.delete_list.title'),
    confirm: t('confirm.delete_list.confirm'),
    cancel: t('confirm.delete_list.cancel'),
  }) === 'confirm') {
    client.v1.lists.remove(listId)
    paginator = (await paginator).filter(item => item.id !== listId)
  }
}
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
          <div hover:bg-active flex justify-between items-center>
            <NuxtLink :to="`list/${item.id}`" block grow p4>
              {{ item.title }}
            </NuxtLink>
            <button
              rounded-full text-sm p2 border-1 transition-colors
              border-base hover:text-primary mr4
              @click="() => removeList(item.id)"
            >
              <span i-ri:delete-bin-2-line block text-current />
            </button>
          </div>
        </template>
      </CommonPaginator>
    </slot>
  </MainContent>
</template>
