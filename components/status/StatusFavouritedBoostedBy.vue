<script setup lang="ts">
import { favouritedBoostedByStatusId } from '~/composables/dialog'

const type = ref<'favourited-by' | 'boosted-by'>('favourited-by')

const { client } = useMasto()

function load() {
  return client.value.v1.statuses.$select(favouritedBoostedByStatusId.value!)[type.value === 'favourited-by' ? 'favouritedBy' : 'rebloggedBy'].list()
}

const paginator = computed(() => load())

function showFavouritedBy() {
  type.value = 'favourited-by'
}

function showRebloggedBy() {
  type.value = 'boosted-by'
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
  <AccountPaginator :key="`paginator-${type}`" :paginator="paginator" />
</template>
