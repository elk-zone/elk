<script setup lang="ts">
import type { Notification } from 'masto'

const { notification } = defineProps<{
  notification: Notification
}>()
</script>

<template>
  <article flex flex-col relative>
    <template v-if="notification.type === 'follow'">
      <div flex items-center absolute px-3 py-3 bg-base rounded-br-3 top-0 left-0>
        <div i-ri:user-follow-fill mr-1 color-primary />
        <ContentRich
          text-primary mr-1 font-bold line-clamp-1 ws-pre-wrap break-all
          :content="getDisplayName(notification.account, { rich: true })"
          :emojis="notification.account.emojis"
        />
        <span ws-nowrap>
          {{ $t('notification.followed_you') }}
        </span>
      </div>
      <AccountBigCard :account="notification.account" />
    </template>
    <template v-else-if="notification.type === 'admin.sign_up'">
      <div flex p3 items-center bg-shaded>
        <div i-ri:admin-fill mr-1 color-purple />
        <ContentRich
          text-purple mr-1 font-bold line-clamp-1 ws-pre-wrap break-all
          :content="getDisplayName(notification.account, { rich: true })"
          :emojis="notification.account.emojis"
        />
        <span>signed up</span>
      </div>
    </template>
    <template v-else-if="notification.type === 'follow_request'">
      <div flex ml-4 items-center class="-top-2.5" absolute right-2 px-2>
        <div i-ri:user-follow-fill text-xl mr-1 />
        <AccountInlineInfo :account="notification.account" mr1 />
      </div>
      <!-- TODO: accept request -->
      <AccountCard :account="notification.account" />
    </template>
    <template v-else-if="notification.type === 'favourite'">
      <StatusCard :status="notification.status!" :faded="true">
        <template #meta>
          <div flex="~" gap-1 items-center>
            <div i-ri:heart-fill text-xl mr-1 color-red />
            <AccountInlineInfo text-primary font-bold :account="notification.account" mr1 />
          </div>
        </template>
      </StatusCard>
    </template>
    <template v-else-if="notification.type === 'reblog'">
      <StatusCard :status="notification.status!" :faded="true">
        <template #meta>
          <div flex="~" gap-1 items-center>
            <div i-ri:repeat-fill text-xl mr-1 color-green />
            <AccountInlineInfo text-primary font-bold :account="notification.account" mr1 />
          </div>
        </template>
      </StatusCard>
    </template>
    <template v-else-if="notification.type === 'update'">
      <StatusCard :status="notification.status!" :faded="true">
        <template #meta>
          <div flex="~" gap-1 items-center>
            <div i-ri:edit-2-fill text-xl mr-1 text-secondary />
            <AccountInlineInfo :account="notification.account" mr1 />
            <span ws-nowrap>
              {{ $t('notification.update_status') }}
            </span>
          </div>
        </template>
      </StatusCard>
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
