<script setup lang="ts">
import type { StatusEdit } from 'masto'

const { edit } = defineProps<{
  edit: StatusEdit
}>()
</script>

<template>
  <div px3 py-4 flex="~ col">
    <div text-center flex="~ row gap-1">
      <AccountInlineInfo :account="edit.account" />
      edited {{ useFormattedDateTime(edit.createdAt).value }}
    </div>

    <div h1px bg="gray/20" my2 />

    <StatusSpoiler :enabled="edit.sensitive">
      <template #spoiler>
        {{ edit.spoilerText }}
      </template>
      <StatusBody :status="edit" />
      <StatusMedia
        v-if="edit.mediaAttachments.length"
        :status="edit"
      />
    </StatusSpoiler>
  </div>
</template>
