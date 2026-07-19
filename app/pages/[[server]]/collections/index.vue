<script setup lang="ts">
type CollectionsTab = 'my_collections' | 'in_collections'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
const client = useMastoClient()
const accountId = currentUser.value?.account?.id

const tab = ref<CollectionsTab>('my_collections')
const tabOptions: { name: CollectionsTab, display: string }[] = [
  { name: 'my_collections', display: t('tab.my_collections') },
  { name: 'in_collections', display: t('tab.in_collections') },
]

let collectionsData = null
let inCollectionsData = null
if (accountId) {
  const [collectionsResult, inCollectionsResult] = await Promise.allSettled([
    client.v1.accounts.$select(accountId).collections.list(),
    client.v1.accounts.$select(accountId).inCollections.list(),
  ])
  if (collectionsResult.status === 'fulfilled') {
    collectionsData = collectionsResult.value
  }
  if (inCollectionsResult.status === 'fulfilled') {
    inCollectionsData = inCollectionsResult.value
  }
}

const activeCollections = computed(() =>
  tab.value === 'my_collections' ? collectionsData?.collections : inCollectionsData?.collections,
)
</script>

<template>
  <div>
    <div flex w-full items-center lg:text-lg>
      <button
        v-for="option in tabOptions"
        :key="option.name"
        flex flex-auto cursor-pointer px3 m1 rounded transition-all
        hover:bg-active transition-100
        @click="tab = option.name"
      >
        <span
          mxa px4 py3 text-center border-b-3
          :class="tab === option.name ? 'font-bold border-primary' : 'op50 border-transparent'"
        >{{ option.display }}</span>
      </button>
    </div>

    <div v-if="activeCollections?.length" divide-y="base">
      <NuxtLink
        v-for="collection in activeCollections"
        :key="collection.id"
        :to="{
          name: 'collection',
          params: { server: currentServer, id: collection.id },
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
