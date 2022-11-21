<script setup lang="ts">
import type { Notification } from 'masto'

const { notification } = defineProps<{
  notification: Notification
}>()

const displayName = $computed(() => getDisplayName(notification.account))
</script>

<template>
  <div flex flex-col>
    <template v-if="notification.type === 'follow'">
      <div flex ml-4>
        <div i-ri:user-follow-fill mr-3 color-purple />{{ displayName }} followed you
      </div>
      <AccountCard :account="notification.account" p3 />
    </template>
    <template v-if="notification.type === 'follow_request'">
      <div flex ml-4>
        <div i-ri:user-follow-fill mr-3 color-gray />{{ displayName }} requested to follow you
      </div>
      <!-- TODO: accept request -->
      <AccountCard :account="notification.account" p3 />
    </template>
    <template v-if="notification.type === 'favourite'">
      <div flex ml-4>
        <div i-ri:heart-fill mr-3 color-red />{{ displayName }} favourited your post
      </div>
      <StatusCard :status="notification.status!" p3 />
    </template>
    <template v-if="notification.type === 'reblog'">
      <div flex ml-4>
        <div i-ri:repeat-fill mr-3 color-green />{{ displayName }} reblogged your post
      </div>
      <StatusCard :status="notification.status!" p3 />
    </template>
    <template v-if="notification.type === 'mention' || notification.type === 'poll'">
      <StatusCard :status="notification.status!" p3 />
    </template>
  </div>
</template>
