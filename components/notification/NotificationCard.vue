<script setup lang="ts">
import type { Notification } from 'masto'

const { notification } = defineProps<{
  notification: Notification
}>()
</script>

<template>
  <article flex flex-col relative>
    <template v-if="notification.type === 'follow'">
      <div flex ml-4 items-center absolute class="-top-2.5" right-2 px-2>
        <div i-ri:user-follow-fill mr-1 color-primary />
        <AccountInlineInfo :account="notification.account" mr1 />
        {{ $t('notification.followed_you') }}
      </div>
      <AccountCard :account="notification.account" />
    </template>
    <template v-else-if="notification.type === 'follow_request'">
      <div flex ml-4 items-center class="-top-2.5" absolute right-2 px-2>
        <div i-ri:user-follow-fill mr-1 />
        <AccountInlineInfo :account="notification.account" mr1 />
      </div>
      <!-- TODO: accept request -->
      <AccountCard :account="notification.account" />
    </template>
    <template v-else-if="notification.type === 'favourite'">
      <CommonMetaWrapper>
        <div i-ri:heart-fill mr-1 color-red />
        <AccountInlineInfo :account="notification.account" mr1 />
      </CommonMetaWrapper>
      <StatusCard :status="notification.status!" :decorated="true" />
    </template>
    <template v-else-if="notification.type === 'reblog'">
      <CommonMetaWrapper>
        <div i-ri:repeat-fill mr-1 color-green />
        <AccountInlineInfo :account="notification.account" mr1 />
      </CommonMetaWrapper>
      <StatusCard :status="notification.status!" :decorated="true" />
    </template>
    <template v-else-if="notification.type === 'update'">
      <CommonMetaWrapper>
        <div i-ri:edit-2-fill mr-1 text-secondary />
        <AccountInlineInfo :account="notification.account" mr1 />
        {{ $t('notification.update_status') }}
      </CommonMetaWrapper>
      <StatusCard :status="notification.status!" :decorated="true" />
    </template>
    <template v-else-if="notification.type === 'mention' || notification.type === 'poll' || notification.type === 'status'">
      <StatusCard :status="notification.status!" />
    </template>
    <template v-else>
      <div text-red font-bold>
        [DEV] {{ $t('notification.missing_type') }} '{{ notification.type }}'
      </div>
    </template>
  </article>
</template>
