<script setup lang="ts">
import type { mastodon } from 'masto'

const { client } = useMasto()
const accounts = ref<mastodon.v1.Account[]>([])
const loading = ref(false)
const errored = ref(false)

async function load() {
  if (!client.value)
    return
  loading.value = true
  errored.value = false
  try {
    // Mastodon's directory endpoint returns local accounts who opted in.
    // We pass `order=new` to surface recent signups, capped at 5.
    accounts.value = await client.value.v1.directory.list({ order: 'new', local: true, limit: 5 })
  }
  catch (e) {
    console.error('[NavNewMembers] failed to load directory', e)
    errored.value = true
  }
  finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section rounded-3 bg-card p-4 mx-1 style="display: flex; flex-direction: column; gap: 1.5rem;">
    <div flex items-center justify-between>
      <h3 text-base font-bold>
        New on Omedia
      </h3>
      <button
        type="button"
        text-secondary hover:text-primary cursor-pointer
        aria-label="Refresh"
        :disabled="loading"
        @click="load"
      >
        <div :class="loading ? 'i-ri:loader-2-fill animate-spin' : 'i-ri:refresh-line'" text-base />
      </button>
    </div>

    <div v-if="errored" text-sm text-secondary>
      Couldn't load recent signups.
    </div>
    <div v-else-if="loading && accounts.length === 0" text-sm text-secondary>
      Loading…
    </div>
    <div v-else-if="accounts.length === 0" text-sm text-secondary>
      No new members yet.
    </div>

    <div v-else flex="~ col gap-3">
      <div
        v-for="account in accounts"
        :key="account.id"
        flex="~ gap-2" items-center
      >
        <NuxtLink :to="getAccountRoute(account)" shrink-0>
          <AccountAvatar :account="account" class="h-9 w-9" />
        </NuxtLink>
        <NuxtLink :to="getAccountRoute(account)" flex="~ col" flex-1 min-w-0 pe-4>
          <span text-sm font-bold line-clamp-1 break-all>
            {{ getDisplayName(account) || account.username }}
          </span>
          <span text-xs text-secondary line-clamp-1 break-all>
            {{ getShortHandle(account) }}
          </span>
        </NuxtLink>
        <div class="compact-follow shrink-0">
          <AccountFollowButton :account="account" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.compact-follow :deep(button) {
  min-width: 72px !important;
  width: 72px;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}
</style>
