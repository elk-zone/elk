<script setup lang="ts">
import type { Component } from 'vue'

const route = useRoute()
const id = $computed(() => route.params.status as string)
const main = ref<Component | null>(null)

const status = window.history.state?.status ?? await fetchStatus(id)
const { data: context } = useAsyncData(`context:${id}`, () => masto.statuses.fetchContext(id))
</script>

<template>
  <MainContent>
    <template v-if="status">
      <template v-if="context">
        <template v-for="comment of context?.ancestors" :key="comment.id">
          <StatusCard :status="comment" border="t base" py3 />
        </template>
      </template>

      <StatusDetails ref="main" :status="status" border="t base" />
      <PublishWidget
        v-if="currentUser"
        border="t base"
        :draft-key="`reply-${id}`"
        :placeholder="`Reply to ${status?.account ? getDisplayName(status?.account) : 'this thread'}`"
        :in-reply-to-id="id"
      />

      <template v-if="context">
        <template v-for="comment of context?.descendants" :key="comment.id">
          <StatusCard :status="comment" border="t base" py3 />
        </template>
      </template>
    </template>

    <CommonNotFound v-else>
      Status not found
    </CommonNotFound>
  </MainContent>
</template>
