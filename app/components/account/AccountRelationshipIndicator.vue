<script setup lang="ts">
import type { mastodon } from 'masto'

defineProps<{
  relationship: mastodon.v1.Relationship
}>()

const { t } = useI18n()
</script>

<template>
  <span
    v-if="relationship.followedBy"
    border border-base rounded-md px-2 text-secondary-light
  >
    {{ relationship.following ? t('account.mutuals') : t('account.follows_you') }}
  </span>
</template>
