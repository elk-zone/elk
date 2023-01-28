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

function getFieldIconTitle(fieldName: string) {
  return fieldName === 'Joined' ? t('account.joined') : fieldName
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
    if (icon)
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
        <div flex="~ col gap-2 1">
          <button :class="{ 'rounded-full': !isSelf, 'squircle': isSelf }" w-30 h-30 p1 bg-base border-bg-base z-2 @click="previewAvatar">
            <AccountAvatar :square="isSelf" :account="account" hover:opacity-90 transition-opacity />
          </button>
          <div flex="~ col gap1">
            <div flex justify-between>
              <AccountDisplayName :account="account" font-bold sm:text-2xl text-xl />
              <AccountBotIndicator v-if="account.bot" show-label />
            </div>
            <AccountHandle :account="account" />
          </div>
        </div>
        <div absolute top-18 inset-ie-0 flex gap-2 items-center>
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
          <AccountFollowButton :account="account" :command="command" />
          <!-- Edit profile -->
          <NuxtLink
            v-if="isSelf"
            to="/settings/profile/appearance"
            gap-1 items-center border="1" rounded-full flex="~ gap2 center" font-500 min-w-30 h-fit px3 py1
            hover="border-primary text-primary bg-active"
          >
            {{ $t('settings.profile.appearance.title') }}
          </NuxtLink>
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
      <div v-if="iconFields.length" flex="~ wrap gap-4">
        <div v-for="field in iconFields" :key="field.name" flex="~ gap-1" items-center>
          <CommonTooltip :content="getFieldIconTitle(field.name)">
            <div text-secondary :class="getAccountFieldIcon(field.name)" :title="getFieldIconTitle(field.name)" />
          </CommonTooltip>
          <ContentRich text-sm filter-saturate-0 :content="field.value" :emojis="account.emojis" />
        </div>
      </div>
      <AccountPostsFollowers :account="account" />
    </div>
  </div>
</template>
