<script setup lang="ts">
import type { mastodon } from 'masto'

const { account } = defineProps<{
  account: mastodon.v1.Account
  command?: boolean
}>()

const { client } = useMasto()

const { t } = useI18n()

const createdAt = useFormattedDateTime(() => account.createdAt, {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const relationship = useRelationship(account)

const namedFields = ref<mastodon.v1.AccountField[]>([])
const iconFields = ref<mastodon.v1.AccountField[]>([])
const isEditingPersonalNote = ref<boolean>(false)
const hasHeader = computed(() => !account.header.endsWith('/original/missing.png'))
const isCopied = ref<boolean>(false)

function getFieldIconTitle(fieldName: string) {
  return fieldName === 'Joined' ? t('account.joined') : fieldName
}

function getNotificationIconTitle() {
  return relationship.value?.notifying ? t('account.notifications_on_post_disable', { username: `@${account.username}` }) : t('account.notifications_on_post_enable', { username: `@${account.username}` })
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
  relationship.value!.notifying = !relationship.value?.notifying
  try {
    const newRel = await client.value.v1.accounts.$select(account.id).follow({ notify: relationship.value?.notifying })
    Object.assign(relationship!, newRel)
  }
  catch {
    // TODO error handling
    relationship.value!.notifying = !relationship.value?.notifying
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
    value: createdAt.value,
  })

  namedFields.value = named
  iconFields.value = icons
})

const personalNoteDraft = ref(relationship.value?.note ?? '')
watch(relationship, (relationship, oldValue) => {
  if (!oldValue && relationship)
    personalNoteDraft.value = relationship.note ?? ''
})

async function editNote(event: Event) {
  if (!event.target || !('value' in event.target) || !relationship.value)
    return

  const newNote = event.target?.value as string

  if (relationship.value.note?.trim() === newNote.trim())
    return

  const newNoteApiResult = await client.value.v1.accounts.$select(account.id).note.create({ comment: newNote })
  relationship.value.note = newNoteApiResult.note
  personalNoteDraft.value = relationship.value.note ?? ''
}

const isSelf = useSelfAccount(() => account)
const isNotifiedOnPost = computed(() => !!relationship.value?.notifying)

const personalNoteMaxLength = 2000

async function copyAccountName() {
  try {
    const shortHandle = getShortHandle(account)
    const serverName = getServerName(account)
    const accountName = `${shortHandle}@${serverName}`
    await navigator.clipboard.writeText(accountName)
  }
  catch (err) {
    console.error('Failed to copy account name:', err)
  }

  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}
</script>

<template>
  <div flex flex-col>
    <div v-if="relationship?.requestedBy" p-4 flex justify-between items-center bg-card>
      <span text-primary font-bold>{{ $t('account.requested', [account.displayName]) }}</span>
      <AccountFollowRequestButton :account="account" :relationship="relationship" />
    </div>
    <component :is="hasHeader ? 'button' : 'div'" border="b base" z-1 @click="hasHeader ? previewHeader() : undefined">
      <img h-50 height="200" w-full object-cover :src="account.header" :alt="t('account.profile_description', [account.username])">
    </component>
    <div p4 mt--18 flex flex-col gap-4>
      <div relative>
        <div flex justify-between>
          <button shrink-0 h-full :class="{ 'rounded-full': !isSelf, 'squircle': isSelf }" p1 bg-base border-bg-base z-2 @click="previewAvatar">
            <AccountAvatar :square="isSelf" :account="account" hover:opacity-90 transition-opacity w-28 h-28 />
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
              <AccountMoreButton
                :account="account" :command="command"
                @add-note="isEditingPersonalNote = true"
                @remove-note="() => { isEditingPersonalNote = false; personalNoteDraft = '' }"
              />
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
          <div flex gap2 items-center flex-wrap>
            <AccountDisplayName :account="account" font-bold sm:text-2xl text-xl />
            <AccountLockIndicator v-if="account.locked" show-label />
            <AccountBotIndicator v-if="account.bot" show-label />
          </div>

          <div flex items-center gap-1>
            <AccountHandle :account="account" overflow-unset line-clamp-unset />
            <CommonTooltip placement="bottom" :content="$t('account.copy_account_name')" flex>
              <button text-secondary-light text-sm :class="isCopied ? 'i-ri:check-fill text-green' : 'i-ri:file-copy-line'" @click="copyAccountName">
                <span sr-only>{{ $t('account.copy_account_name') }}</span>
              </button>
            </CommonTooltip>
          </div>
          <div self-start mt-1>
            <AccountRolesIndicator v-if="account.roles?.length" :account="account" />
          </div>
        </div>
      </div>
      <label
        v-if="isEditingPersonalNote || (relationship?.note && relationship.note.length > 0)"
        space-y-2
        pb-4
        block
        border="b base"
      >
        <div flex flex-row space-x-2 flex-v-center>
          <div i-ri-edit-2-line />
          <p font-medium>
            {{ $t('account.profile_personal_note') }}
          </p>
          <p text-secondary text-sm :class="{ 'text-orange': personalNoteDraft.length > (personalNoteMaxLength - 100) }">
            {{ personalNoteDraft.length }} / {{ personalNoteMaxLength }}
          </p>
        </div>
        <div position-relative>
          <div
            input-base
            min-h-10ex
            whitespace-pre-wrap
            opacity-0
            :class="{ 'trailing-newline': personalNoteDraft.endsWith('\n') }"
          >
            {{ personalNoteDraft }}
          </div>
          <textarea
            v-model="personalNoteDraft"
            input-base
            position-absolute
            style="height: 100%"
            top-0
            resize-none
            :maxlength="personalNoteMaxLength"
            @change="editNote"
          />
        </div>
      </label>
      <div v-if="account.note" max-h-100 overflow-y-auto>
        <ContentRich text-4 text-base :content="account.note" :emojis="account.emojis" />
      </div>
      <div v-if="namedFields.length" flex="~ col wrap gap1">
        <div v-for="field in namedFields" :key="field.name" flex="~ gap-1" items-center>
          <div mt="0.5" text-secondary uppercase text-xs font-bold>
            <ContentRich :content="field.name" :emojis="account.emojis" />
          </div>
          <span text-secondary text-xs font-bold>|</span>
          <ContentRich :content="field.value" :emojis="account.emojis" />
        </div>
      </div>
      <div v-if="iconFields.length" flex="~ wrap gap-2">
        <div v-for="field in iconFields" :key="field.name" flex="~ gap-1" px1 items-center :class="`${field.verifiedAt ? 'border-1 rounded-full border-dark' : ''}`">
          <CommonTooltip :content="getFieldIconTitle(field.name)">
            <div text-secondary :class="getAccountFieldIcon(field.name)" :title="getFieldIconTitle(field.name)" />
          </CommonTooltip>
          <ContentRich text-sm :content="field.value" :emojis="account.emojis" />
        </div>
      </div>
      <AccountPostsFollowers :account="account" />
    </div>
  </div>
</template>

<style>
.trailing-newline::after {
  content: '\a';
}
</style>
