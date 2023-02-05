<script setup lang="ts">
import type { mastodon } from 'masto'

const { status, context } = defineProps<{
  status: mastodon.v1.Status
  newer?: mastodon.v1.Status
  context?: mastodon.v2.FilterContext | 'details'
}>()

const isDM = $computed(() => status.visibility === 'direct')
const isDetails = $computed(() => context === 'details')

// Content Filter logic
const filterResult = $computed(() => status.filtered?.length ? status.filtered[0] : null)
const filter = $computed(() => filterResult?.filter)

const filterPhrase = $computed(() => filter?.title)
const isFiltered = $computed(() => status.account.id !== currentUser.value?.account.id && filterPhrase && context && context !== 'details' && !!filter?.context.includes(context))

// check spoiler text or media attachment
// needed to handle accounts that mark all their posts as sensitive
const hasSensitiveSpoilerOrMedia = $computed(() => status.sensitive && (!!status.spoilerText || !!status.mediaAttachments.length))
</script>

<template>
  <div
    space-y-3
    :class="{
      'pt2 pb0.5 px3.5 bg-dm rounded-4 me--1': isDM,
      'ms--3.5 mt--1 ms--1': isDM && context !== 'details',
    }"
  >
    <StatusBody v-if="!isFiltered && status.sensitive && !status.spoilerText" :status="status" :newer="newer" :with-action="!isDetails" :class="isDetails ? 'text-xl' : ''" />
    <StatusSpoiler :enabled="hasSensitiveSpoilerOrMedia || isFiltered" :filter="isFiltered" :is-d-m="isDM">
      <template v-if="status.spoilerText" #spoiler>
        <p>{{ status.spoilerText }}</p>
      </template>
      <template v-else-if="filterPhrase" #spoiler>
        <p>{{ `${$t('status.filter_hidden_phrase')}: ${filterPhrase}` }}</p>
      </template>
      <StatusBody v-if="!status.sensitive || status.spoilerText" :status="status" :newer="newer" :with-action="!isDetails" :class="isDetails ? 'text-xl' : ''" />
      <StatusTranslation :status="status" />
      <StatusPoll v-if="status.poll" :status="status" />
      <StatusMedia
        v-if="status.mediaAttachments?.length"
        :status="status"
      />
      <StatusPreviewCard
        v-if="status.card"
        :card="status.card"
        :small-picture-only="status.mediaAttachments?.length > 0"
      />
      <StatusCard
        v-if="status.reblog"
        :status="status.reblog" border="~ rounded"
        :actions="false"
      />
      <div v-if="isDM" />
    </StatusSpoiler>
  </div>
</template>
