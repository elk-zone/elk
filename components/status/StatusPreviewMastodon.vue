<script setup lang="ts">
import type { mastodon } from 'masto'

const props = withDefaults(defineProps<{
  card: mastodon.v1.PreviewCard
  linkToStatus: URL
  sourceStatus?: mastodon.v1.Status
  inNotification?: boolean
}>(), {
  inNotification: false,
})

const userSettings = useUserSettings()

// build the Status from Card
const card = $computed(() => props.card)
const linkToStatus = $computed(() => props.linkToStatus)
const sourceStatus = computed(() => props.sourceStatus)

const acct: string = $computed(() => (window.location.hostname === linkToStatus.host) ? linkToStatus.pathname.split('/')[1].replace('@', '') : `${linkToStatus.pathname.split('/')[1].replace('@', '')}@${linkToStatus.hostname}`)
const username: string = $computed(() => acct.split('@')[0])
const serverName: string = $computed(() => acct.split('@')[1])
const possibleMediaAttachment: mastodon.v1.MediaAttachment | undefined = $computed(() => {
  const hasImageAttachment = (card.description.search(/^attached.? ?\d* +image/gi) !== null)
  const hasVideoAttachment = (card.description.search(/^attached.? ?\d* +video/gi) !== null)

  if (!hasImageAttachment && !hasVideoAttachment)
    return undefined
  return {
    id: card.image!,
    type: (hasImageAttachment) ? 'image' : 'video',
    previewUrl: card.image!,
    blurhash: card.blurhash,
  }
})

const derivedStatus = $computed(() => {
  const path: string = linkToStatus.pathname
  const placeholderAccount = {
    id: '',
    acct,
    displayName: card.title.replaceAll(/\(@[^\)]+\)/gi, '').trim(),
    bot: false,
    avatar: 'https://static.fedified.com/avatars/original/missing.png',
  }

  return {
    id: path.substring(path.lastIndexOf('/') + 1),
    uri: linkToStatus.toString(),
    url: linkToStatus.toString(),
    createdAt: sourceStatus?.value?.createdAt, // this is a filler in lieu of a Masto API call
    editedAt: null,
    mentions: Array<mastodon.v1.StatusMention>(),
    emojis: Array<mastodon.v1.CustomEmoji>(),
    language: null,
    content: card.description.replace(/^attached.? ?\d* (?:image|video)?[\n\r]*/gi, '').trim(),
    // account: useAccountByHandle(acct).value ?? placeholderAccount as mastodon.v1.Account,
    account: placeholderAccount as mastodon.v1.Account,
    mediaAttachments: (!possibleMediaAttachment) ? Array<mastodon.v1.MediaAttachment>() : [possibleMediaAttachment],
  } as mastodon.v1.Status
})

const createdAt = useFormattedDateTime(derivedStatus.createdAt)
const timeAgoOptions = useTimeAgoOptions(true)
const timeago = useTimeAgo(() => derivedStatus.createdAt ?? Date.now(), timeAgoOptions)
</script>

<template v-if="derivedStatus.account">
  <div
    flex flex-col
    display-block of-hidden
    bg-code
    relative
    w-full
    justify-start
    rounded-2xl
    class="border-width-[0.05rem] border-[var(--c-text-secondary)]"
  >
    <div
      p4 flex flex-col justify-between
      basis-50 flex-auto min-h-fit max-h-fit
    >
      <!-- START -->
      <!-- Account Info -->
      <div flex basis-full flex-nowrap items-center space-x-2>
        <div flex="~ row gap-2" grow flex-nowrap items-center justify-items-start align-baseline min-w-fit max-w-fit font-bold text-primary>
          <AccountAvatar
            :account="derivedStatus.account" :square="false"
            basis-1em flex-auto max-w-5 line-clamp-1 ws-pre-wrap
          />
          <AccountDisplayName
            :account="derivedStatus.account" :hide-emojis="getPreferences(userSettings, 'hideUsernameEmojis')"
            flex-none min-w-fit max-w-fit font-bold line-clamp-1 ws-pre-wrap break-all text-primary
          />
          <AccountBotIndicator
            v-if="derivedStatus.account.bot"
            flex-none min-w-fit max-w-fit me-1
          />
        </div>
        <div flex="~ row gap-2" shrink min-w-0 flex-nowrap items-start align-baseline max-w-fit class="zen-none">
          <div flex="~ row gap-0" basis-0 grow min-w-0 flex-nowrap items-start align-baseline max-w-fit line-clamp-1 ws-pre-wrap class="zen-none">
            <div min-w-content>
              <span text-secondary>{{ username }}</span>
            </div>
            <div v-if="serverName" basis-0 grow min-w-0 max-w-fit flex-nowrap items-start align-baseline>
              <span line-clamp-1 overflow-x-hidden text-secondary font-thin p0 m0 break-all>@{{ serverName }}</span>
            </div>
            <div flex-none items-start align-baseline min-w-fit line-clamp-1 class="zen-none">
              <span text-secondary text-secondary-light> &bull; {{ timeago }}</span>
            </div>
          </div>
        </div>
        <div flex-auto />
        <StatusActionsMore v-if="derivedStatus" :status="derivedStatus" :details="false" :command="false" :hide-favorited-and-boosted-by="true" :hide-mention-account="true" me--2 />
      </div>
      <!-- Content -->
      <div space-y-3 my-2>
        <NuxtLink v-if="derivedStatus.url" :to="derivedStatus.url" external target="_blank">
          <StatusBody v-if="derivedStatus" :status="derivedStatus" :with-action="false" class="font-light" />
        </NuxtLink>
      </div>
      <!-- Attachments -->
      <div v-if="card.image" space-y-3 my-2>
        <StatusMedia
          v-if="derivedStatus.mediaAttachments?.length > 0"
          :status="derivedStatus"
          :is-preview="true"
        />
      </div>
      <!-- END -->
      <div flex justify-between>
        <div />
        <div text-2xl i-ri:mastodon-fill text-secondary />
      </div>
    </div>
  </div>
</template>
