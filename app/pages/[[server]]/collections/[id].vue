<script setup lang="ts">
import type { mastodon } from 'masto'

definePageMeta({
  name: 'collection',
})

const { t } = useI18n()
const params = useRoute().params
const collectionId = computed(() => params.id as string)

const client = useMastoClient()

const { data: collectionData } = await useAsyncData<mastodon.v1.CollectionWithAccounts | null>(
  () => `collection-${collectionId.value}`,
  () => client.v1.collections.$select(collectionId.value).fetch().catch(() => null),
  { immediate: import.meta.client, default: () => shallowRef() },
)

const accounts = computed(() => collectionData.value?.accounts ?? [])
const collection = computed(() => collectionData.value?.collection)
const ownerAccount = computed(() => accounts.value.find(a => a.id === collection.value?.accountId))

const memberAccounts = computed(() =>
  accounts.value.filter(a => a.id !== (ownerAccount.value?.id ?? ''),
  ))

useHydratedHead({
  title: t('nav.collections'),
})
</script>

<template>
  <MainContent back>
    <template #title>
      <MainTitle>
        {{ t('nav.collections') }}
      </MainTitle>
    </template>

    <template v-if="!collectionData">
      <CommonNotFound>
        {{ $t('error.collection_not_found') }}
      </CommonNotFound>
    </template>
    <template v-else-if="collection">
      <div p-4 border="b base" space-y-3>
        <div flex items-center gap-2 text-start text-lg font-bold>
          {{ collection.name }}
        </div>

        <div v-if="ownerAccount" flex items-center gap-2 text-sm text-secondary>
          <span mr5>{{ $t('collection.created_by') }}</span>
          <AccountInlineInfo :account="ownerAccount" class="pl1" />
        </div>

        <div flex text-sm text-secondary gap-4>
          <span>{{ $t('collection.item_count', [collection.itemCount]) }}</span>
        </div>

        <div v-if="collection.description" text-secondary>
          {{ collection.description }}
        </div>

        <div v-if="collection.tag" flex items-center gap-2>
          <NuxtLink :to="collection.tag.url" text-primary text-sm font-bold hover:underline>
            #{{ collection.tag.name }}
          </NuxtLink>
        </div>
      </div>

      <div v-if="memberAccounts.length > 0" divide-y="base">
        <div
          v-for="account in memberAccounts"
          :key="account.id"
          py3 px4 space-y-2
        >
          <div flex justify-between items-center>
            <AccountInfo
              :account="account"
              hover-card
              as="router-link"
              shrink overflow-hidden
              :to="getAccountRoute(account)"
            />
            <AccountFollowButton :account="account" />
          </div>
          <div v-if="account.note" text-sm text-secondary>
            <ContentRich
              :content="account.note" :emojis="account.emojis"
            />
          </div>
        </div>
      </div>
      <div v-else p-4 text-secondary text-sm text-center>
        {{ $t('collection.empty') }}
      </div>
    </template>
  </MainContent>
</template>
