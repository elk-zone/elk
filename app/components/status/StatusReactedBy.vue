<script setup lang="ts">
import type { mastodon } from 'masto'
import { reactedByStatusId } from '~/composables/dialog'

const type = ref<'favourited-by' | 'boosted-by' | 'quoted-by'>('favourited-by')

const { client } = useMasto()

function load() {
  if (type.value !== 'quoted-by') {
    const accounts = client.value.v1.statuses.$select(reactedByStatusId.value!)[type.value === 'favourited-by' ? 'favouritedBy' : 'rebloggedBy'].list()
    return accounts
  }
  else {
    const quotes = client.value.v1.statuses.$select(reactedByStatusId.value!).quotes.list()
    return quotes
  }
}

function preprocess(items: mastodon.v1.Status[] | mastodon.v1.Account[]): mastodon.v1.Account[] {
  if (type.value !== 'quoted-by')
    return items as mastodon.v1.Account[]

  return (items as mastodon.v1.Status[]).map(quote => quote.account)
}

const paginator = computed(() => load())

function showFavouritedBy() {
  type.value = 'favourited-by'
}

function showRebloggedBy() {
  type.value = 'boosted-by'
}

function showQuotedBy() {
  type.value = 'quoted-by'
}

const { t } = useI18n()
const tabs = [
  {
    name: 'favourited-by',
    display: t('status.favourited_by'),
    onClick: showFavouritedBy,
  },
  {
    name: 'boosted-by',
    display: t('status.boosted_by'),
    onClick: showRebloggedBy,
  },
  {
    name: 'quoted-by',
    display: t('status.quoted_by'),
    onClick: showQuotedBy,
  },
]
</script>

<template>
  <div flex w-full items-center lg:text-lg of-x-auto scrollbar-hide>
    <template
      v-for="option in tabs"
      :key="option.name"
    >
      <div
        relative flex flex-auto cursor-pointer sm:px6 px2 rounded transition-all
        tabindex="0"
        hover:bg-active transition-100
        @click="option.onClick"
      >
        <span
          ws-nowrap mxa sm:px2 sm:py3 xl:pb4 xl:pt5 py2 text-center border-b-3
          :class="option.name === type ? 'border-primary op100 text-base' : 'border-transparent text-secondary-light hover:text-secondary op50'"
        >{{
          option.display
        }}</span>
      </div>
    </template>
  </div>
  <!-- @vue-expect-error TODO: fix union type error (Account[] | Status[]) -->
  <AccountPaginator :key="`paginator-${type}`" :paginator="paginator" :preprocess="preprocess" />
</template>
