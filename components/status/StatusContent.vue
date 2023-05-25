<script setup lang="ts">
import type { mastodon } from 'masto'

const { status, context } = defineProps<{
  status: mastodon.v1.Status
  newer?: mastodon.v1.Status
  context?: mastodon.v2.FilterContext | 'details'
  isPreview?: boolean
  inNotification?: boolean
}>()

const linkToStatus = $computed(() => {
  if (!status)
    return undefined
  const uriMatches = status.content.matchAll(/(?:href=\"(https[^"]+)\" rel)/mgi) // (https:\/\/[a-z0-9]+(?:[-a-z0-9()@:%_\+.~#?&\/=]+)+)/gi)
  for (const mm of uriMatches) {
    if (mm[0] !== null) {
      // see https://github.com/mastodon/mastodon/blob/c1e70a20720741c33ac740242a8a7082fab23557/config/routes.rb#L128
      // see also https://github.com/mastodon/mastodon/blob/c1e70a20720741c33ac740242a8a7082fab23557/app/models/account.rb#L65
      const shortAccountStatus = mm[1].search(/[\/]@[a-z0-9_]+([a-z0-9_\.-]+[a-z0-9_]+)?[\/][0-9]+[\/]?$/gi)
      if (shortAccountStatus !== -1) {
        try {
          const url = new URL(mm[1].replace(/[\/]$/gi, ''))
          return url
        }
        catch (e) {
          return undefined
        }
      }

      // see https://github.com/mastodon/mastodon/blob/c1e70a20720741c33ac740242a8a7082fab23557/config/routes.rb#L89
      const longAccountStatus = mm[1].search(/[\/]users[\/][a-z0-9_]+([a-z0-9_\.-]+[a-z0-9_]+)?[\/]statuses[\/][0-9]+[\/]?$/gi)
      if (longAccountStatus !== -1) {
        try {
          const url = new URL(mm[1].replace(/[\/]$/gi, ''))
          const p = url.pathname.replaceAll(/([\/]users[\/])|([\/]statuses)/gi, '')
          url.pathname = `/@${p}`
          return url
        }
        catch (e) {
          return undefined
        }
      }
      return undefined
    }
  }
})

const isDM = $computed(() => status.visibility === 'direct')
const isDetails = $computed(() => context === 'details')

// Content Filter logic
const filterResult = $computed(() => status.filtered?.length ? status.filtered[0] : null)
const filter = $computed(() => filterResult?.filter)

const filterPhrase = $computed(() => filter?.title)
const isFiltered = $computed(() => status.account.id !== currentUser.value?.account.id && filterPhrase && context && context !== 'details' && !!filter?.context.includes(context))

// check spoiler text or media attachment
// needed to handle accounts that mark all their posts as sensitive
const spoilerTextPresent = $computed(() => !!status.spoilerText && status.spoilerText.trim().length > 0)
const hasSpoilerOrSensitiveMedia = $computed(() => spoilerTextPresent || (status.sensitive && !!status.mediaAttachments.length))
const isSensitiveNonSpoiler = computed(() => status.sensitive && !status.spoilerText && !!status.mediaAttachments.length)
const hideAllMedia = computed(
  () => {
    return currentUser.value ? (getHideMediaByDefault(currentUser.value.account) && !!status.mediaAttachments.length) : false
  },
)
</script>

<template>
  <div
    space-y-3
    my-4
    :class="{
      'pt2 pb0.5 px3.5 bg-dm rounded-4 me--1': isDM,
      'ms--3.5 mt--1 ms--1': isDM && context !== 'details',
    }"
  >
    <StatusBody v-if="(!isFiltered && isSensitiveNonSpoiler) || hideAllMedia" :status="status" :newer="newer" :with-action="!isDetails" :class="isDetails ? 'text-xl' : ''" />
    <StatusSpoiler :enabled="hasSpoilerOrSensitiveMedia || isFiltered" :filter="isFiltered" :sensitive-non-spoiler="isSensitiveNonSpoiler || hideAllMedia" :is-d-m="isDM">
      <template v-if="spoilerTextPresent" #spoiler>
        <p>{{ status.spoilerText }}</p>
      </template>
      <template v-else-if="filterPhrase" #spoiler>
        <p>{{ `${$t('status.filter_hidden_phrase')}: ${filterPhrase}` }}</p>
      </template>
      <StatusBody v-if="!(isSensitiveNonSpoiler || hideAllMedia)" :status="status" :newer="newer" :with-action="!isDetails" :class="isDetails ? 'text-xl' : ''" />
      <StatusTranslation :status="status" />
      <StatusPoll v-if="status.poll" :status="status" />
      <StatusMedia
        v-if="status.mediaAttachments?.length"
        :status="status"
        :is-preview="isPreview"
      />
      <StatusPreviewCard
        v-if="status.card"
        :status="status"
        :card="status.card"
        :link-to-status="linkToStatus"
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
