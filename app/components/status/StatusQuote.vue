<script setup lang="ts">
import type { mastodon } from 'masto'

const {
  status,
  isNested = false,
} = defineProps<{
  status: mastodon.v1.Status | mastodon.v1.StatusEdit
  isNested?: boolean
}>()

function isQuoteType(quote: mastodon.v1.Status['quote']): quote is mastodon.v1.Quote | mastodon.v1.ShallowQuote {
  return !!quote
}

function isShallowQuoteType(quote: mastodon.v1.Quote | mastodon.v1.ShallowQuote): quote is mastodon.v1.ShallowQuote {
  return 'quotedStatusId' in quote
}

const quoteState = computed(() => {
  if (!isQuoteType(status.quote)) {
    return null
  }
  return status.quote.state
})
const shallowQuotedStatus = ref<mastodon.v1.Status | null>(null)
watchEffect(async () => {
  if (!isQuoteType(status.quote) || !isShallowQuoteType(status.quote) || !status.quote.quotedStatusId) {
    shallowQuotedStatus.value = null
    return
  }
  shallowQuotedStatus.value = await fetchStatus(status.quote.quotedStatusId)
})

const quotedStatus = computed(() => {
  if (!isQuoteType(status.quote)) {
    return null
  }
  if (isShallowQuoteType(status.quote)) {
    if (!status.quote.quotedStatusId) {
      return null
    }
    return shallowQuotedStatus.value
  }
  return status.quote.quotedStatus
})
</script>

<template>
  <div
    v-if="isNested && quotedStatus"
    flex b="~ 1" rounded-lg bg-card mt-3 p-3
  >
    Quoted post by
    <AccountInlineInfo :account="quotedStatus.account" :link="false" mx-1 />
  </div>
  <template
    v-else-if="quotedStatus"
  >
    <StatusCard
      v-show="quoteState === 'accepted'"
      :status="quotedStatus"
      :actions="false"
      :is-nested="true"
      b="base 1" rounded-lg hover:bg-active my-3
    />
    <p>(state.state: {{ JSON.stringify(status.quote?.state) }})</p>
    <!--
      TODO: handle non-accepted quoted post
      pending: never;
      accepted: never;
      rejected: never;
      revoked: never;
      deleted: never;
      unauthorized: never;

      pending: The quote has been created but requires the original author's manual approval before it can be displayed to others.
      accepted: The quote has been approved by the original author and is ready to be displayed.
      rejected: The original author has explicitly rejected the quote, and it will not be displayed.
      revoked: The quote was previously accepted but the original author has since revoked it.
      deleted: The quote was accepted, but the original post has since been deleted.
      unauthorized: The user is not authorized to see the quote (e.g., it was a private post).
      blocked_account: The user has blocked the account that was quoted.
      blocked_domain: The user has blocked the domain of the account that was quoted.
      muted_account: The user has muted the account that was quoted.
    -->
  </template>
</template>

<style scoped>
* {
  cursor: pointer;
}
</style>
