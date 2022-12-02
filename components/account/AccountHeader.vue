<script setup lang="ts">
import type { Account, Field } from 'masto'

const { account } = defineProps<{
  account: Account
  command?: boolean
}>()

const { t } = useI18n()

const createdAt = $(useFormattedDateTime(() => account.createdAt, {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}))

const namedFields = ref<Field[]>([])
const iconFields = ref<Field[]>([])

const fieldNameIcons: Record<string, string> = {
  github: 'i-ri:github-fill',
  twitter: 'i-ri:twitter-line',
  mastodon: 'i-ri:mastodon-line',
  youtube: 'i-ri:youtube-line',
  twitch: 'i-ri:twitch-line',
  instagram: 'i-ri:instagram-line',
  website: 'i-ri:link',
  site: 'i-ri:link',
  portfolio: 'i-ri:link',
  blog: 'i-ri:newspaper-line',
  home: 'i-ri:home-2-line',
  sponsors: 'i-ri:heart-3-line',
  location: 'i-ri:map-pin-2-line',
  city: 'i-ri:map-pin-2-line',
  joined: 'i-ri:user-add-line',
  birth: 'i-ri:calendar-line',
  tumblr: 'i-ri:tumblr-fill',
  linkedin: 'i-ri:linkedin-box-fill',
  facebook: 'i-ri:facebook-fill',
  patreon: 'i-ri:patreon-fill',
}

function getFieldNameIcon(fieldName: string) {
  const name = fieldName.trim().toLowerCase()
  if (fieldNameIcons[name])
    return fieldNameIcons[name]
}
function getFieldIconTitle(fieldName: string) {
  return fieldName === 'Joined' ? t('account.joined') : fieldName
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

watchEffect(() => {
  const named: Field[] = []
  const icons: Field[] = []

  account.fields?.forEach((field) => {
    const icon = getFieldNameIcon(field.name)
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
</script>

<template>
  <div flex flex-col>
    <button border="b base" z-1>
      <img h-50 w-full object-cover :src="account.header" :alt="t('account.profile_description', [account.username])" @click="previewHeader">
    </button>
    <div p4 mt--18 flex flex-col gap-4>
      <div relative>
        <div flex="~ col gap-2 1">
          <button w-30 h-30 rounded-full border-4 border-bg-base z-2 @click="previewAvatar">
            <AccountAvatar :account="account" hover:opacity-90 transition-opacity />
          </button>
          <div flex flex-col>
            <ContentRich font-bold text-2xl break-words :content="getDisplayName(account, { rich: true })" :emojis="account.emojis" />
            <AccountHandle :account="account" />
          </div>
        </div>
        <div absolute top="1/2" right-0 translate-y="-1/2" flex gap-2 items-center>
          <AccountMoreButton :account="account" :command="command" />
          <AccountFollowButton :account="account" :command="command" />
          <!-- <button flex gap-1 items-center w-full rounded op75 hover="op100 text-purple" group>
            <div rounded p2 group-hover="bg-rose/10">
              <div i-ri:bell-line />
            </div>
          </button> -->
        </div>
      </div>
      <div v-if="account.note">
        <ContentRich text-4 text-secondary :content="account.note" :emojis="account.emojis" />
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
          <div text-secondary :class="getFieldNameIcon(field.name)" :title="getFieldIconTitle(field.name)" />
          <ContentRich text-sm filter-saturate-0 :content="field.value" :emojis="account.emojis" />
        </div>
      </div>
      <AccountPostsFollowers :account="account" />
    </div>
  </div>
</template>
