<script setup lang="ts">
import type { mastodon } from 'masto'

// TODO: masto.js needs to update those two props modified in Mastodon v4.3+
// ref. RelationshipSeveranceEvent - Mastodon documentation
// - https://docs.joinmastodon.org/entities/RelationshipSeveranceEvent/
const { event } = defineProps<{
  event: mastodon.v1.RelationshipSeveranceEvent & {
    followersCount?: number | null
    followingCount?: number | null
  }
}>()

const { t } = useI18n()

const type = event.type
const from = currentServer
const target = event.targetName
const followers = event.followersCount
const following = event.followingCount
</script>

<template>
  <p v-if="type === 'account_suspension'">
    {{ t('notification.relationship_severance.account_suspension', [from, target]) }}
  </p>
  <p v-else-if="type === 'domain_block'">
    {{ t('notification.relationship_severance.domain_block', { from, target, followers, n: following }) }}
  </p>
  <p v-else-if="type === 'user_domain_block'">
    {{ t("notification.relationship_severance.user_domain_block", { target, followers, n: following }) }}
  </p>

  <NuxtLink :to="`https://${currentServer}/severed_relationships`" target="_blank">
    Learn more
  </NuxtLink>
</template>
