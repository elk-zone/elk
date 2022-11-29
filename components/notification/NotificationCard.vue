<script setup lang="ts">
import type { Notification } from 'masto'

const { notification } = defineProps<{
  notification: Notification
}>()
</script>

<template>
  <article flex flex-col>
    <template v-if="notification.type === 'follow'">
      <div flex ml-4 items-center>
        <div i-ri:user-follow-fill mr-3 color-primary />
        <AccountInlineInfo :account="notification.account" mr1 />
        {{ $t('notification.followed_you') }}
      </div>
      <AccountCard :account="notification.account" p3 />
    </template>
    <template v-else-if="notification.type === 'follow_request'">
      <div flex ml-4 items-center>
        <div i-ri:user-follow-fill mr-3 />
        <AccountInlineInfo :account="notification.account" mr1 />
        {{ $t('notification.request_to_follow') }}
      </div>
      <!-- TODO: accept request -->
      <AccountCard :account="notification.account" p3 />
    </template>
    <template v-else-if="notification.type === 'favourite'">
      <div flex ml-4 items-center>
        <div i-ri:heart-fill mr-3 color-red />
        <AccountInlineInfo :account="notification.account" mr1 />
        {{ $t('notification.favourited_post') }}
      </div>
      <StatusCard :status="notification.status!" p3 />
    </template>
    <template v-else-if="notification.type === 'reblog'">
      <div flex ml-4 items-center>
        <div i-ri:repeat-fill mr-3 color-green />
        <AccountInlineInfo :account="notification.account" mr1 />
        {{ $t('notification.reblogged_post') }}
      </div>
      <StatusCard :status="notification.status!" p3 />
    </template>
    <template v-else-if="notification.type === 'update'">
      <div flex ml-4 items-center>
        <div i-ri:edit-2-fill mr-3 text-secondary />
        <AccountInlineInfo :account="notification.account" mr1 />
        {{ $t('notification.update_status') }}
      </div>
      <StatusCard :status="notification.status!" p3 />
    </template>
    <template v-else-if="notification.type === 'mention' || notification.type === 'poll' || notification.type === 'status'">
      <StatusCard :status="notification.status!" p3 />
    </template>
    <template v-else>
      <div text-red font-bold>
        [DEV] {{ $t('notification.missing_type') }} '{{ notification.type }}'
      </div>
    </template>
  </article>
</template>
