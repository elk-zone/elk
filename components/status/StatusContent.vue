<script setup lang="ts">
import type { FilterContext, Status } from 'masto'

const { status, context } = defineProps<{
  status: Status
  context?: FilterContext | 'details'
}>()

const isDM = $computed(() => status.visibility === 'direct')
const isDetails = $computed(() => context === 'details')

// Content Filter logic
const filterResult = $computed(() => status.filtered?.length ? status.filtered[0] : null)
const filter = $computed(() => filterResult?.filter)

// a bit of a hack due to Filter being different in v1 and v2
// clean up when masto.js supports explicit versions: https://github.com/neet/masto.js/issues/722
const filterPhrase = $computed(() => filter?.phrase || (filter as any)?.title)
const isFiltered = $computed(() => filterPhrase && (context && context !== 'details' ? filter?.context.includes(context) : false))
</script>

<template>
  <div
    space-y-3
    :class="{
      'pt2 pb0.5 px3.5 bg-fade border-1 border-primary-light rounded-5 me--1': isDM,
      'ms--3.5 mt--1 ms--1': isDM && context !== 'details',
    }"
  >
    <StatusBody v-if="!isFiltered && status.sensitive && !status.spoilerText" :status="status" :with-action="!isDetails" :class="isDetails ? 'text-xl' : ''" />
    <StatusSpoiler :enabled="status.sensitive || isFiltered" :filter="isFiltered">
      <template v-if="filterPhrase" #spoiler>
        <p>{{ `${$t('status.filter_hidden_phrase')}: ${filterPhrase}` }}</p>
      </template>
      <template v-else-if="status.spoilerText" #spoiler>
        <p>{{ status.spoilerText }}</p>
      </template>
      <StatusBody v-if="!status.sensitive || status.spoilerText" :status="status" :with-action="!isDetails" :class="isDetails ? 'text-xl' : ''" />
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
