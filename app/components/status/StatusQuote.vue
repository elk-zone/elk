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

const quoteState = computed<mastodon.v1.QuoteState | null>(() => {
  if (!isQuoteType(status.quote)) {
    return null
  }
  return status.quote.state
})
const shallowQuotedStatus = ref<mastodon.v1.Status | null>(null)
watchEffect(async () => {
  if (!isQuoteType(status.quote) || !isShallowQuoteType(status.quote) || quoteState.value === 'deleted' || !status.quote.quotedStatusId) {
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
  <template v-if="quotedStatus">
    <template v-if="isNested && quoteState">
      <div
        v-if="quoteState === 'pending'"
        flex b="~ 1" rounded-lg bg-card mt-3 p-3
      >
        Post pending for approval by author
      </div>
      <div
        v-else-if="quoteState === 'revoked'"
        flex b="~ 1" rounded-lg bg-card mt-3 p-3
      >
        Post removed by author
      </div>
      <div
        v-else-if="quoteState === 'blocked_account'"
        flex b="~ 1" rounded-lg bg-card mt-3 p-3
      >
        Post by blocked author
      </div>
      <div
        v-else-if="quoteState === 'blocked_domain'"
        flex b="~ 1" rounded-lg bg-card mt-3 p-3
      >
        Post from blocked server
      </div>
      <div
        v-else-if="quoteState === 'muted_account'"
        flex b="~ 1" rounded-lg bg-card mt-3 p-3
      >
        Post by muted author
      </div>
      <div
        v-else-if="quoteState === 'deleted' || quoteState === 'rejected' || quoteState === 'unauthorized'"
        flex b="~ 1" rounded-lg bg-card mt-3 p-3
      >
        Post is unavailable
      </div>
      <div
        v-else-if="quoteState === 'accepted'"
        flex b="~ 1" rounded-lg bg-card mt-3 p-3
      >
        Post by
        <AccountInlineInfo :account="quotedStatus.account" :link="false" mx-1 />
      </div>
    </template>
    <template v-else>
      <div
        v-if="quoteState === 'pending'"
        flex b="~ 1" rounded-lg bg-card mt-3 p-3
      >
        Post pending for approval by author
      </div>
      <div
        v-else-if="quoteState === 'revoked'"
        flex b="~ 1" rounded-lg bg-card mt-3 p-3
      >
        Post removed by author
      </div>
      <div
        v-else-if="quoteState === 'deleted' || quoteState === 'rejected' || quoteState === 'unauthorized'"
        flex b="~ 1" rounded-lg bg-card mt-3 p-3
      >
        Post is unavailable
      </div>
      <blockquote
        v-else-if="quoteState === 'accepted'"
        :cite="quotedStatus.uri"
      >
        <StatusCard
          :status="quotedStatus"
          :actions="false"
          :is-nested="true"
          b="base 1" rounded-lg hover:bg-active my-3
        />
      </blockquote>
    </template>
  </template>
</template>

<style scoped>
* {
  cursor: pointer;
}
</style>
