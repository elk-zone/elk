<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()
const { translation } = useTranslation(status)

const [showContent, toggleContent] = $(useToggle(!status.sensitive))
</script>

<template>
  <div class="status-body" whitespace-pre-wrap break-words>
    <template v-if="status.sensitive">
      {{ status.spoilerText }}
      <button btn-outline px-2 py-1 text-3 @click="toggleContent()">
        {{ showContent ? 'Show less' : 'Show more' }}
      </button>
    </template>

    <ContentRichSetup
      v-if="showContent"
      :content="translation.visible ? translation.text : status.content"
      :emojis="status.emojis"
    />
  </div>
</template>
