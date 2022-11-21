<script setup lang="ts">
const { currentUser } = $(useClientState())

const params = useRoute().params
const id = computed(() => params.post as string)

const masto = await useMasto()
const { data: status } = await useAsyncData(`${id}-status`, () => masto.statuses.fetch(params.post as string))
const { data: context } = await useAsyncData(`${id}-context`, () => masto.statuses.fetchContext(params.post as string))
</script>

<template>
  <template v-if="status">
    <template v-for="comment of context?.ancestors" :key="comment.id">
      <StatusCard :status="comment" border="t border" pt-4 />
    </template>
    <StatusDetails :status="status" border="t border" pt-4 />
    <div border="t border" p6 flex gap-4>
      <img :src="currentUser?.account?.avatar" rounded w-10 h-10 bg-gray:10>
      <PublishWidget
        w-full
        :draft-key="`reply-${id}`"
        :placeholder="`Reply to ${status?.account ? getDisplayName(status?.account) : 'this thread'}`"
        :in-reply-to-id="id"
      />
    </div>

    <template v-for="comment of context?.descendants" :key="comment.id">
      <StatusCard :status="comment" border="t border" pt-4 />
    </template>
  </template>

  <template>
    <div>
      Status not found
    </div>
  </template>
</template>
