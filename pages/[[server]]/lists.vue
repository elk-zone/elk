<script lang="ts" setup>
import type { mastodon } from 'masto'
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
  }) === 'confirm')
    await client.v1.lists.remove(listId)
  // TODO: Make this not suck
  useRouter().go(0)
}

const isEditing = ref('')

function toggleEditing(list: mastodon.v1.List) {
  if (isEditing.value === list.id)
    isEditing.value = ''

  else
    isEditing.value = list.id
}

async function finishEditing(list: mastodon.v1.List) {
  await client.v1.lists.update(list.id, {
    title: list.title,
  })
  isEditing.value = ''
}

const createText = ref('')

async function createList() {
  await client.v1.lists.create({
    title: createText.value,
  })
  createText.value = ''
  // TODO: Make this also not suck
  useRouter().go(0)
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
            <div v-if="isEditing === item.id" bg-base border="~ base" h10 m2 px-4 rounded-3 w-full flex="~ row" items-center relative focus-within:box-shadow-outline gap-3>
              <input
                v-model="item.title"
                rounded-3
                w-full
                bg-transparent
                outline="focus:none"
                pe-4
                pb="1px"
                placeholder-text-secondary
                @keypress.enter="() => finishEditing(item)"
              >
            </div>
            <NuxtLink v-else :to="`list/${item.id}`" block grow p4>
              {{ item.title }}
            </NuxtLink>
            <div mr4 flex gap2>
              <CommonTooltip :content="t('list.edit')">
                <button
                  rounded-full text-sm p2 border-1 transition-colors
                  border-base hover:text-primary
                  @click="() => toggleEditing(item)"
                >
                  <span i-ri:edit-2-line block text-current />
                </button>
              </CommonTooltip>
              <CommonTooltip :content="t('list.delete')">
                <button
                  rounded-full text-sm p2 border-1 transition-colors
                  border-base hover:text-primary
                  @click="() => removeList(item.id)"
                >
                  <span i-ri:delete-bin-2-line block text-current />
                </button>
              </CommonTooltip>
            </div>
          </div>
        </template>
        <template #done>
          <div bg-base border="~ base" h10 m2 px-4 rounded-3 w-full flex="~ row" items-center relative focus-within:box-shadow-outline gap-3>
            <input
              v-model="createText"
              rounded-3
              w-full
              bg-transparent
              outline="focus:none"
              pe-4
              pb="1px"
              placeholder-text-secondary
              :placeholder="t('list.create')"
              @keypress.enter="createList"
            >
          </div>
        </template>
      </CommonPaginator>
    </slot>
  </MainContent>
</template>
