<script setup lang="ts">
import type { Account } from 'masto'

const { account } = defineProps<{
  account: Account
}>()

const createdAt = $computed(() => {
  const date = new Date(account.createdAt)
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date)
})

const fields = $computed(() => {
  return [
    ...account.fields || [],
    {
      name: 'Joined',
      value: createdAt,
    },
  ]
})

const fieldNameIcons: Record<string, string> = {
  github: 'i-ri:github-fill',
  twitter: 'i-ri:twitter-line',
  mastodon: 'i-ri:mastodon-line',
  youtube: 'i-ri:youtube-line',
  twitch: 'i-ri:twitch-line',
  instagram: 'i-ri:instagram-line',
  website: 'i-ri:link',
  site: 'i-ri:link',
  blog: 'i-ri:newspaper-line',
  home: 'i-ri:home-2-line',
  sponsors: 'i-ri:heart-3-line',
  location: 'i-ri:map-pin-2-line',
  city: 'i-ri:map-pin-2-line',
  joined: 'i-ri:user-add-line',
  birth: 'i-ri:calendar-line',
}

function getFieldNameIcon(fieldName: string) {
  const name = fieldName.trim().toLowerCase()
  if (fieldNameIcons[name])
    return fieldNameIcons[name]
}
</script>

<template>
  <div flex flex-col>
    <div border="b base">
      <img h-50 w-full object-cover :src="account.header">
    </div>
    <div p4 mt--17 flex flex-col gap-6>
      <div flex justify-between>
        <div flex flex-col gap-2>
          <div>
            <NuxtLink :to="getAccountPath(account)">
              <AccountAvatar :account="account" w-30 h-30 />
            </NuxtLink>
          </div>
          <div flex flex-col>
            <ContentRich font-bold text-2xl :content="getDisplayName(account)" :emojis="account.emojis" />
            <p op50>
              {{ getAccountHandle(account) }}
            </p>
          </div>
        </div>
        <div flex gap-2 items-center>
          <AccountFollowButton :account="account" />
          <!-- <button flex gap-1 items-center w-full rounded op75 hover="op100 text-purple" group>
            <div rounded p2 group-hover="bg-rose/10">
              <div i-ri:bell-line />
            </div>
          </button>
          <button flex gap-1 items-center w-full rounded op75 hover="op100 text-purple" group>
            <div rounded p2 group-hover="bg-purple/10">
              <div i-ri:more-2-fill />
            </div>
          </button> -->
        </div>
      </div>
      <div>
        <div text-4 text-gray v-html="account.note" />
      </div>
      <div flex flex-wrap gap-4>
        <div v-for="field in fields" :key="field.name" flex="~ gap-1" items-center>
          <div v-if="getFieldNameIcon(field.name)" op50 :class="getFieldNameIcon(field.name)" :title="field.name" />
          <div v-else op50 uppercase text-xs font-bold>
            {{ field.name }} |
          </div>
          <ContentRich text-sm filter-saturate-0 :content="field.value" />
        </div>
      </div>
      <div flex gap-5>
        <NuxtLink :to="`/${getAccountHandle(account)}/`" exact-active-class="text-primary">
          <span font-bold>{{ account.statusesCount }}</span> <span op50>Posts</span>
        </NuxtLink>
        <NuxtLink :to="`/${getAccountHandle(account)}/following`" exact-active-class="text-primary">
          <span font-bold>{{ account.followingCount }}</span> <span op50>Following</span>
        </NuxtLink>
        <NuxtLink :to="`/${getAccountHandle(account)}/followers`" exact-active-class="text-primary">
          <span font-bold>{{ account.followersCount }}</span> <span op50>Followers</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
