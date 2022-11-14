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
    <div>
      <img h-50 w-full object-cover :src="account.header">
    </div>
    <div p3 style="margin-top:-3.5rem;" flex flex-col gap-6>
      <div flex justify-between>
        <div flex flex-col gap-2>
          <div p1>
            <NuxtLink :to="`/@${account.acct}`">
              <img :src="account.avatar" rounded w-20 h-20>
            </NuxtLink>
          </div>
          <NuxtLink flex flex-col :to="`/@${account.acct}`">
            <h4 font-bold>
              {{ account.displayName }}
            </h4>
            <p op50>
              @{{ account.acct }}
            </p>
          </NuxtLink>
        </div>
        <div flex gap-2>
          <button flex gap-1 items-center w-full rounded op75 hover="op100 text-white b-purple" group>
            <div rounded p2 group-hover="bg-rose/10">
              Follow
            </div>
          </button>
          <button flex gap-1 items-center w-full rounded op75 hover="op100 text-purple" group>
            <div rounded p2 group-hover="bg-rose/10">
              <div i-ri:bell-line />
            </div>
          </button>
          <button flex gap-1 items-center w-full rounded op75 hover="op100 text-purple" group>
            <div rounded p2 group-hover="bg-purple/10">
              <div i-ri:more-2-fill />
            </div>
          </button>
        </div>
      </div>
      <div>
        <div text-4 text-gray-3 v-html="account.note" />
      </div>
      <div flex flex-col gap-1>
        <div flex flex-col rounded p3 class="bg-purple/10">
          <p text-gray text-3 uppercase>
            Joined
          </p>
          <p text-3 text-gray-3>
            {{ createdAt }}
          </p>
        </div>
        <div v-for="field in account.fields" :key="field.name" flex flex-col rounded p3 class="bg-purple/10">
          <p text-gray text-3 uppercase>
            {{ field.name }}
          </p>
          <p text-3 text-purple-3 v-html="field.value" />
        </div>
      </div>
      <div flex gap-5>
        <div><span font-bold>{{ account.statusesCount }}</span> Posts</div>
        <div><span font-bold>{{ account.followingCount }}</span> Following</div>
        <div><span font-bold>{{ account.followersCount }}</span> Followers</div>
      </div>
    </div>
  </div>
</template>
