<script setup lang="ts">
import type { mastodon } from 'masto'

const { account } = defineProps<{
  account: mastodon.v1.Account
  command?: boolean
}>()

const { client } = $(useMasto())

const { t } = useI18n()

const createdAt = $(useFormattedDateTime(() => account.createdAt, {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}))

const relationship = $(useRelationship(account))

const namedFields = ref<mastodon.v1.AccountField[]>([])
const iconFields = ref<mastodon.v1.AccountField[]>([])
const hasHeader = $computed(() => !account.header.endsWith('/original/missing.png'))

function getIconFieldTitle(fieldName: string): string {
  return fieldName === 'Joined' ? t('account.joined') : fieldName
}

/**
 * Get the link href of a link field, if any.
 * @param fieldValue - The field's full value given by the Mastodon API, either an HTML string or plain text
 */
function getIconFieldHref(fieldValue: string): string {
  const valueHTML = document.createRange().createContextualFragment(fieldValue)
  return valueHTML.firstChild?.href || undefined
}

function getNotificationIconTitle() {
  return relationship?.notifying ? t('account.notifications_on_post_disable', { username: `@${account.username}` }) : t('account.notifications_on_post_enable', { username: `@${account.username}` })
}

function previewHeader() {
  openMediaPreview([{
    id: `${account.acct}:header`,
    type: 'image',
    previewUrl: account.header,
    description: t('account.profile_description', [account.username]),
  }])
}

function previewAvatar() {
  openMediaPreview([{
    id: `${account.acct}:avatar`,
    type: 'image',
    previewUrl: account.avatar,
    description: t('account.avatar_description', [account.username]),
  }])
}

async function toggleNotifications() {
  relationship!.notifying = !relationship?.notifying
  try {
    const newRel = await client.v1.accounts.follow(account.id, { notify: relationship?.notifying })
    Object.assign(relationship!, newRel)
  }
  catch {
    // TODO error handling
    relationship!.notifying = !relationship?.notifying
  }
}

watchEffect(() => {
  const named: mastodon.v1.AccountField[] = []
  const icons: mastodon.v1.AccountField[] = []

  account.fields?.forEach((field) => {
    const icon = getAccountFieldIcon(field.name)
    const isLink = !!field.value.match('^<a href=')

    if (icon || isLink)
      icons.push(field)
    else
      named.push(field)
  })
  icons.push({
    name: 'Joined',
    value: createdAt,
  })

  namedFields.value = named
  iconFields.value = icons
})

const isSelf = $(useSelfAccount(() => account))
const isNotifiedOnPost = $computed(() => !!relationship?.notifying)
</script>

<template>
  <div flex flex-col>
    <component :is="hasHeader ? 'button' : 'div'" border="b base" z-1 @click="hasHeader ? previewHeader() : undefined">
      <img h-50 height="200" w-full object-cover :src="account.header" :alt="t('account.profile_description', [account.username])">
    </component>
    <div p4 mt--18 flex flex-col gap-4>
      <div relative>
        <div flex justify-between>
          <button shrink-0 :class="{ 'rounded-full': !isSelf, 'squircle': isSelf }" w-30 h-30 p1 bg-base border-bg-base z-2 @click="previewAvatar">
            <AccountAvatar :square="isSelf" :account="account" hover:opacity-90 transition-opacity />
          </button>
          <div inset-ie-0 flex="~ wrap row-reverse" gap-2 items-center pt18 justify-start>
            <!-- Edit profile -->
            <NuxtLink
              v-if="isSelf"
              to="/settings/profile/appearance"
              gap-1 items-center border="1" rounded-full flex="~ gap2 center" font-500 min-w-30 h-fit px3 py1
              hover="border-primary text-primary bg-active"
            >
              {{ $t('settings.profile.appearance.title') }}
            </NuxtLink>
            <AccountFollowButton :account="account" :command="command" />
            <span inset-ie-0 flex gap-2 items-center>
              <AccountMoreButton :account="account" :command="command" />
              <CommonTooltip v-if="!isSelf && relationship?.following" :content="getNotificationIconTitle()">
                <button
                  :aria-pressed="isNotifiedOnPost"
                  :aria-label="t('account.notifications_on_post_enable', { username: `@${account.username}` })"
                  rounded-full text-sm p2 border-1 transition-colors
                  :class="isNotifiedOnPost ? 'text-primary border-primary hover:bg-red/20 hover:text-red hover:border-red' : 'border-base hover:text-primary'"
                  @click="toggleNotifications"
                >
                  <span v-if="isNotifiedOnPost" i-ri:notification-4-fill block text-current />
                  <span v-else i-ri-notification-4-line block text-current />
                </button>
              </CommonTooltip>
              <CommonTooltip :content="$t('list.modify_account')">
                <VDropdown v-if="!isSelf && relationship?.following">
                  <button
                    :aria-label="$t('list.modify_account')"
                    rounded-full text-sm p2 border-1 transition-colors
                    border-base hover:text-primary
                  >
                    <span i-ri:play-list-add-fill block text-current />
                  </button>
                  <template #popper>
                    <ListLists :user-id="account.id" />
                  </template>
                </VDropdown>
              </CommonTooltip>
            </span>
          </div>
        </div>
        <div flex="~ col gap1" pt2>
          <div flex justify-between>
            <AccountDisplayName :account="account" font-bold sm:text-2xl text-xl />
            <AccountBotIndicator v-if="account.bot" show-label />
          </div>
          <AccountHandle :account="account" />
        </div>
      </div>
      <div v-if="account.note" max-h-100 overflow-y-auto>
        <ContentRich text-4 text-base :content="account.note" :emojis="account.emojis" />
      </div>
      <div v-if="namedFields.length" flex="~ col wrap gap1">
        <div v-for="field in namedFields" :key="field.name" flex="~ gap-1" items-center>
          <div text-secondary uppercase text-xs font-bold>
            {{ field.name }} |
          </div>
          <ContentRich :content="field.value" :emojis="account.emojis" />
        </div>
      </div>
      <div v-if="iconFields.length" flex="~ wrap gap-1" style="margin-inline: -0.25rem;">
        <NuxtLink
          v-for="field in iconFields" :key="field.name"
          flex="~ gap-1" items-center rounded-full :hover="getIconFieldHref(field.value) ? 'bg-active' : ''"
          style="padding-inline-start: 0.5rem; padding-inline-end: 0.75rem;"
          :class="field.verifiedAt ? 'border-1 border-dark' : ''"
          :to="getIconFieldHref(field.value)" rel="me nofollow noopener noreferrer" target="_blank"
        >
          <div
            text-secondary :class="field.verifiedAt
              ? accountVerifiedFieldIcon
              : (getAccountFieldIcon(field.name) || getAccountFieldIcon('Website'))"
            :title="field.verifiedAt ? 'Verified' : undefined"
            :aria-label="field.verifiedAt ? 'Verified.' : undefined"
          />
          <div flex="~ col">
            <div text-secondary uppercase font-medium style="font-size: 0.6rem; margin-bottom: -0.5em;">
              {{ field.name }}
            </div>
            <ContentRich text-sm :content="field.value" :emojis="account.emojis" />
          </div>
        </NuxtLink>
      </div>
      <AccountPostsFollowers :account="account" />
    </div>
  </div>
</template>
