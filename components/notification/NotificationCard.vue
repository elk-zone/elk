<script setup lang="ts">
import type { mastodon } from 'masto'

const { notification } = defineProps<{
  notification: mastodon.v1.Notification
}>()
</script>

<template>
  <article flex flex-col relative>
    <template v-if="notification.type === 'follow'">
      <NuxtLink
        :to="getAccountRoute(notification.account)"
        @click="$rememberAccountPosition(getAccountRoute(notification.account).fullPath)"
      >
        <div
          flex items-center absolute
          ps-3 pe-4 inset-is-0
          rounded-ie-be-3
          py-3 bg-base top-0
          :lang="notification.status?.language ?? undefined"
        >
          <div i-ri:user-follow-fill me-1 color-primary />
          <AccountDisplayName :account="notification.account" text-primary me-1 font-bold line-clamp-1 ws-pre-wrap break-all />
          <span ws-nowrap>
            {{ $t('notification.followed_you') }}
          </span>
        </div>
        <AccountBigCard
          :account="notification.account"
          :lang="notification.status?.language ?? undefined"
        />
      </NuxtLink>
    </template>
    <template v-else-if="notification.type === 'admin.sign_up'">
      <div flex p3 items-center bg-shaded>
        <div i-ri:admin-fill me-1 color-purple />
        <AccountDisplayName
          :account="notification.account"
          text-purple me-1 font-bold line-clamp-1 ws-pre-wrap break-all
        />
        <span>{{ $t("notification.signed_up") }}</span>
      </div>
    </template>
    <template v-else-if="notification.type === 'follow_request'">
      <div flex ms-4 items-center class="-top-2.5" absolute inset-ie-2 px-2>
        <div i-ri:user-follow-fill text-xl me-1 />
        <AccountInlineInfo :account="notification.account" me1 />
      </div>
      <!-- TODO: accept request -->
      <AccountCard :account="notification.account" />
    </template>
    <template v-else-if="notification.type === 'favourite'">
      <StatusCard :status="notification.status!" :faded="true">
        <template #meta>
          <div flex="~" gap-1 items-center mt1>
            <div i-ri:heart-fill text-xl me-1 color-red />
            <AccountInlineInfo text-primary font-bold :account="notification.account" me1 />
          </div>
        </template>
      </StatusCard>
    </template>
    <template v-else-if="notification.type === 'reblog'">
      <StatusCard :status="notification.status!" :faded="true">
        <template #meta>
          <div flex="~" gap-1 items-center mt1>
            <div i-ri:repeat-fill text-xl me-1 color-green />
            <AccountInlineInfo text-primary font-bold :account="notification.account" me1 />
          </div>
        </template>
      </StatusCard>
    </template>
    <template v-else-if="notification.type === 'update'">
      <StatusCard :status="notification.status!" :faded="true">
        <template #meta>
          <div flex="~" gap-1 items-center mt1>
            <div i-ri:edit-2-fill text-xl me-1 text-secondary />
            <AccountInlineInfo :account="notification.account" me1 />
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
