<script setup lang="ts">
definePageMeta({
  name: 'list',
})

const params = useRoute().params
const listId = $(computedEager(() => params.list as string))

const { client } = $(useMasto())
const { data: listInfo, refresh } = $(await useAsyncData(() => client.v1.lists.fetch(listId), { default: () => shallowRef() }))

const paginator = client.v1.timelines.listList(listId)
const stream = useStreaming(client => client.v1.stream.streamListTimeline(listId))

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

const mask = useMask()
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>{{ listInfo ? listInfo.title : $t('nav.list') }}</span>
    </template>
    <template #actions>
      <VDropdown :distance="0" placement="bottom" @apply-show="mask.show()" @apply-hide="mask.hide()">
        <!-- Todo: Why doesn't this look good -->
        <button rounded-full p2 group-hover="bg-orange/10" group-focus-visible="bg-orange/10" group-focus-visible:ring="2 current">
          <div i-ri:user-line />
        </button>
        <template #popper>
          <ListUserList :list-id="listId" />
        </template>
      </VDropdown>
    </template>
    <TimelinePaginator v-bind="{ paginator, stream }" :preprocess="reorderedTimeline" context="home" />
  </MainContent>
</template>
