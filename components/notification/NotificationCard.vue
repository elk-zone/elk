<script setup lang="ts">
import type { Notification } from 'masto'

const { notification } = defineProps<{
  notification: Notification
}>()
</script>

<template>
  <div flex flex-col>
    <template v-if="notification.type === 'follow'">
      <div flex ml-4 items-center>
        <div i-ri:user-follow-fill mr-3 color-primary />
        <AccountInlineInfo :account="notification.account" mr1 />
        followed you
      </div>
      <AccountCard :account="notification.account" p3 />
    </template>
    <template v-else-if="notification.type === 'follow_request'">
      <div flex ml-4 items-center>
        <div i-ri:user-follow-fill mr-3 />
        <AccountInlineInfo :account="notification.account" mr1 />
        requested to follow you
      </div>
      <!-- TODO: accept request -->
      <AccountCard :account="notification.account" p3 />
    </template>
    <template v-else-if="notification.type === 'favourite'">
      <div flex ml-4 items-center>
        <div i-ri:heart-fill mr-3 color-red />
        <AccountInlineInfo :account="notification.account" mr1 />
        favourited your post
      </div>
      <StatusCard :status="notification.status!" p3 />
    </template>
    <template v-else-if="notification.type === 'reblog'">
      <div flex ml-4 items-center>
        <div i-ri:repeat-fill mr-3 color-green />
        <AccountInlineInfo :account="notification.account" mr1 />
        reblogged your post
      </div>
      <StatusCard :status="notification.status!" p3 />
    </template>
    <template v-else-if="notification.type === 'update'">
      <div flex ml-4 items-center>
        <div i-ri:edit-2-fill mr-3 text-secondary />
        <AccountInlineInfo :account="notification.account" mr1 />
        updated their status
      </div>
      <StatusCard :status="notification.status!" p3 />
    </template>
    <template v-else-if="notification.type === 'mention' || notification.type === 'poll' || notification.type === 'status'">
      <StatusCard :status="notification.status!" p3 />
    </template>
    <template v-else>
      <div text-red font-bold>
        [DEV] MISSING notification.type: '{{ notification.type }}'
      </div>
    </template>
  </div>
</template>
