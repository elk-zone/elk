<script lang="ts" setup>
const { t } = useI18n()

const client = useMastoClient()

const paginator = client.v1.lists.list()

useHeadFixed({
  title: () => t('nav.lists'),
})

async function removeList(listId: string) {
  if (await openConfirmDialog({
    title: t('confirm.delete_list.title'),
    confirm: t('confirm.delete_list.confirm'),
    cancel: t('confirm.delete_list.cancel'),
  // eslint-disable-next-line curly
  }) === 'confirm') {
    client.v1.lists.remove(listId)
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
      <CommonPaginator :paginator="paginator" no-end-message>
        <template #default="{ item }">
          <div hover:bg-active flex justify-between items-center>
            <NuxtLink :to="`list/${item.id}`" block grow p4>
              {{ item.title }}
            </NuxtLink>
            <div mr4 flex gap2>
              <button
                rounded-full text-sm p2 border-1 transition-colors
                border-base hover:text-primary
                @click="() => removeList(item.id)"
              >
                <span i-ri:edit-2-line block text-current />
              </button>
              <button
                rounded-full text-sm p2 border-1 transition-colors
                border-base hover:text-primary
                @click="() => removeList(item.id)"
              >
                <span i-ri:delete-bin-2-line block text-current />
              </button>
            </div>
          </div>
        </template>
      </CommonPaginator>
    </slot>
  </MainContent>
</template>
