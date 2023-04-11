<script lang="ts" setup>
import type { mastodon } from 'masto'

const { filter } = defineProps<{
  filter: mastodon.v2.Filter
}>()

const editPath = `/settings/preferences/filters/${filter.id}`
</script>

<template>
  <NuxtLink
    block w-full group focus:outline-none
    :to="editPath"
    @click="$scrollToTop()"
  >
    <div
      w-full flex w-fit px5 py3 md:gap2 gap4 items-center
      transition-250 bg-card group-hover:bg-active rounded-3
      group-focus-visible:ring="2 current"
    >
      <div flex-1 flex items-center md:gap2 gap4>
        <div flex="~ col">
          <p mb-2 text-lg>
            {{ filter.title }}
          </p>
          <p text-sm text-secondary pr-4>
            <span text-primary mr-1>{{ $t('settings.preferences.filters.keywords_list_prefix', filter.keywords.length) }}</span>
            {{
              filter.keywords.length
                ? filter.keywords.map(({ keyword }) => keyword).join(', ')
                : $t('settings.preferences.filters.no_keywords')
            }}
          </p>
          <span flex flex-wrap gap-1 mt-3 items-center>
            <span text-sm mr-2>{{ $t(`settings.preferences.filters.filter_applies_to`) }}</span>
            <template
              v-if="filter.context.length !== 5"
            >
              <span
                v-for="ctx in filter.context" :key="ctx"
                bg-tag px-2 py-1 rounded text-sm text-secondary whitespace-nowrap
              >
                {{ $t(`settings.preferences.filters.context.${ctx}`).toLocaleLowerCase() }}
              </span>
            </template>
            <span
              v-else
              bg-tag px-2 py-1 rounded text-sm text-secondary whitespace-nowrap
            >
              {{ $t('settings.preferences.filters.context.everywhere').toLocaleLowerCase() }}
            </span>
          </span>
        </div>
      </div>
      <div flex="~ row" items-center>
        <div i-ri:arrow-right-s-line text-base />
      </div>
    </div>
  </NuxtLink>
</template>
