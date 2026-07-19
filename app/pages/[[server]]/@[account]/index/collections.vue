<script setup lang="ts">
import type { mastodon } from 'masto'

definePageMeta({
  name: 'account-collections',
})

const { t } = useI18n()
const params = useRoute().params
const handle = computed(() => params.account as string)

const account = await fetchAccountByHandle(handle.value)

const client = useMastoClient()

let collectionData: mastodon.v1.Collections | null = null
if (account) {
  try {
    collectionData = await client.v1.accounts.$select(account.id).collections.list()
  }
  catch {
    // server may not support collections
  }
}

const collections = computed(() => collectionData?.collections ?? [])

if (account) {
  useHydratedHead({
    title: () => `${t('nav.collections')} | ${getDisplayName(account)} (@${account.acct})`,
  })
}
</script>

<template>
  <div>
    <AccountTabs />
    <div v-if="collections.length > 0" divide-y="base">
      <NuxtLink
        v-for="collection in collections"
        :key="collection.id"
        :to="{
          name: 'collection',
          params: { server: params.server, id: collection.id },
        }"
        block p-4 hover:bg-active transition-100
      >
        <div flex items-center gap-3>
          <div i-ri:shapes-line text-xl shrink-0 text-secondary />
          <div flex="~ col" min-w-0>
            <div font-bold truncate>
              {{ collection.name }}
            </div>
            <div v-if="collection.description" text-sm text-secondary truncate>
              {{ collection.description }}
            </div>
            <div text-sm text-secondary>
              {{ $t('collection.item_count', [collection.itemCount]) }}
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
    <div v-else p-4 text-secondary text-sm text-center>
      {{ $t('collection.no_collections') }}
    </div>
  </div>
</template>
