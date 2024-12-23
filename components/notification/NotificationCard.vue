<script setup lang="ts">
import type { mastodon } from 'masto'

// Add undocumented 'annual_report' type introduced in v4.3
// ref. https://github.com/mastodon/documentation/issues/1211#:~:text=api/v1/annual_reports
type NotificationType = mastodon.v1.Notification['type'] | 'annual_report'
type Notification = Omit<mastodon.v1.Notification, 'type'> & { type: NotificationType }

const { notification } = defineProps<{
  notification: Notification
}>()

const { t } = useI18n()

// list of notification types Elk currently implemented
// type 'favourite' and 'reblog' should always rendered by NotificationGroupedLikes
const supportedNotificationTypes: NotificationType[] = [
  'follow',
  'admin.sign_up',
  'admin.report',
  'follow_request',
  'update',
  'mention',
  'poll',
  'update',
  'status',
  'annual_report',
]

// well-known emoji reactions types Elk does not support yet
const unsupportedEmojiReactionTypes = ['pleroma:emoji_reaction', 'reaction']

if (unsupportedEmojiReactionTypes.includes(notification.type) || !supportedNotificationTypes.includes(notification.type)) {
  console.warn(`[DEV] ${t('notification.missing_type')} '${notification.type}' (notification.id: ${notification.id})`)
}
</script>

<template>
  <article flex flex-col relative>
    <template v-if="notification.type === 'follow'">
      <NuxtLink :to="getAccountRoute(notification.account)">
        <div
          flex items-center absolute
          ps-3 pe-4 inset-is-0
          rounded-ie-be-3
          py-3 bg-base top-0
        >
          <div i-ri-user-3-line text-xl me-3 color-blue />
          <AccountDisplayName :account="notification.account" text-primary me-1 font-bold line-clamp-1 ws-pre-wrap break-all />
          <span ws-nowrap>
            {{ $t('notification.followed_you') }}
          </span>
        </div>
        <AccountBigCard
          ms10
          :account="notification.account"
        />
      </NuxtLink>
    </template>
    <template v-else-if="notification.type === 'admin.sign_up'">
      <NuxtLink :to="getAccountRoute(notification.account)">
        <div flex p4 items-center bg-shaded>
          <div i-ri:user-add-line text-xl me-2 color-purple />
          <AccountDisplayName
            :account="notification.account"
            text-purple me-1 font-bold line-clamp-1 ws-pre-wrap break-all
          />
          <span>{{ $t("notification.signed_up") }}</span>
        </div>
      </NuxtLink>
    </template>
    <template v-else-if="notification.type === 'admin.report'">
      <NuxtLink :to="getReportRoute(notification.report?.id!)">
        <div flex p4 items-center bg-shaded>
          <div i-ri:flag-line text-xl me-2 color-purple />
          <i18n-t keypath="notification.reported">
            <AccountDisplayName
              :account="notification.account"
              text-purple me-1 font-bold line-clamp-1 ws-pre-wrap break-all
            />
            <AccountDisplayName
              :account="notification.report?.targetAccount!"
              text-purple ms-1 font-bold line-clamp-1 ws-pre-wrap break-all
            />
          </i18n-t>
        </div>
      </NuxtLink>
    </template>
    <template v-else-if="notification.type === 'follow_request'">
      <div flex px-3 py-2>
        <div i-ri-user-shared-line text-xl me-3 color-blue />
        <AccountDisplayName
          :account="notification.account"
          text-primary me-1 font-bold line-clamp-1 ws-pre-wrap break-all
        />
        <span me-1 ws-nowrap>
          {{ $t('notification.request_to_follow') }}
        </span>
      </div>
      <AccountCard p="s-2 e-4 b-2" hover-card :account="notification.account">
        <AccountFollowRequestButton :account="notification.account" />
      </AccountCard>
    </template>
    <template v-else-if="notification.type === 'update'">
      <StatusCard :status="notification.status!" :in-notification="true" :actions="false">
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
    <template v-else-if="notification.type === 'annual_report'">
      <div flex p4 items-center bg-shaded>
        <div i-mdi:party-popper text-xl me-4 color-purple />
        <div class="content-rich">
          <p>
            Your 2024 <NuxtLink to="/tags/Wrapstodon">
              #Wrapstodon
            </NuxtLink> awaits! Unveil your year's highlights and memorable moments on Mastodon!
          </p>
          <p>
            <NuxtLink :to="`https://${currentServer}/notifications`" target="_blank">
              View #Wrapstodon on Mastodon
            </NuxtLink>
          </p>
        </div>
      </div>
    </template>
  </article>
</template>
