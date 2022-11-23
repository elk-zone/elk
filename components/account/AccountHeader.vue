<script setup lang="ts">
import type { Account } from 'masto'

const { account } = defineProps<{
  account: Account
}>()

const createdAt = $computed(() => {
  const date = new Date(account.createdAt)
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date)
})
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
            <NuxtLink :to="`/@${account.acct}`">
              <AccountAvatar :account="account" w-30 h-30 />
            </NuxtLink>
          </div>
          <div flex flex-col>
            <CommonRichContent font-bold text-2xl :content="getDisplayName(account)" :emojis="account.emojis" />
            <p op50>
              @{{ account.acct }}
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
      <div flex flex-col gap-1>
        <div flex flex-col rounded p3 class="bg-purple/10">
          <p text="gray/70" text-3 uppercase>
            Joined
          </p>
          <p text-3 text-gray>
            {{ createdAt }}
          </p>
        </div>
        <div v-for="field in account.fields" :key="field.name" flex flex-col rounded p3 class="bg-purple/10">
          <p text="gray/70" text-3 uppercase>
            {{ field.name }}
          </p>
          <p text-3 text-purple-3 v-html="field.value" />
        </div>
      </div>
      <div flex gap-5>
        <NuxtLink :to="`/@${account.acct}/`" active-class="text-primary">
          <span font-bold>{{ account.statusesCount }}</span> Posts
        </NuxtLink>
        <NuxtLink :to="`/@${account.acct}/following`" active-class="text-primary">
          <span font-bold>{{ account.followingCount }}</span> Following
        </NuxtLink>
        <NuxtLink :to="`/@${account.acct}/followers`" active-class="text-primary">
          <span font-bold>{{ account.followersCount }}</span> Followers
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
