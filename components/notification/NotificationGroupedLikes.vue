<script setup lang="ts">
import type { GroupedLikeNotifications } from '~/types'

const { group } = defineProps<{
  group: GroupedLikeNotifications
}>()
</script>

<template>
  <article flex flex-col relative>
    <StatusCard :status="group.status!" :faded="true">
      <template #meta>
        <div flex flex-col gap-1 mt-1>
          <div v-for="like of group.likes" :key="like.account.id" flex>
            <div v-if="like.reblog" i-ri:repeat-fill text-xl me-2 color-green />
            <div v-if="like.favourite && !like.reblog" i-ri:heart-fill text-xl me-2 color-red />
            <AccountInlineInfo text-primary font-bold :account="like.account" me2 />
            <div v-if="like.favourite && like.reblog" i-ri:heart-fill text-xl me-2 color-red />
          </div>
        </div>
      </template>
    </StatusCard>
  </article>
</template>
