<script setup lang="ts">
import type { Component } from 'vue'

const params = useRoute().params
const id = computed(() => params.post as string)
const main = ref<Component | null>(null)

const { data: status } = await useAsyncData(`status-${id}`, () => masto.statuses.fetch(params.post as string))
const { data: context } = useAsyncData(`context-${id}`, () => masto.statuses.fetchContext(params.post as string))
</script>

<template>
  <template v-if="status">
    <template v-if="context">
      <template v-for="comment of context?.ancestors" :key="comment.id">
        <StatusCard :status="comment" border="t base" pt-4 />
      </template>
    </template>

    <StatusDetails ref="main" :status="status" border="t base" pt-4 />
    <div v-if="currentUser" border="t base" p6 flex gap-4>
      <AccountAvatar :account="currentUser.account" w-10 h-10 />
      <PublishWidget
        w-full
        :draft-key="`reply-${id}`"
        :placeholder="`Reply to ${status?.account ? getDisplayName(status?.account) : 'this thread'}`"
        :in-reply-to-id="id"
      />
    </div>

    <template v-if="context">
      <template v-for="comment of context?.descendants" :key="comment.id">
        <StatusCard :status="comment" border="t base" pt-4 />
      </template>
    </template>
  </template>

  <CommonNotFound v-else>
    Status not found
  </CommonNotFound>
</template>
