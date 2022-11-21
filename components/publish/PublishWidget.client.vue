<script setup lang="ts">
import type { CreateStatusParamsWithStatus } from 'masto'

const {
  draftKey,
  placeholder = 'What is on your mind?',
  inReplyToId,
} = defineProps<{
  draftKey: string
  placeholder?: string
  inReplyToId?: string
}>()

const masto = await useMasto()

let isSending = $ref(false)
const storageKey = `nuxtodon-draft-${draftKey}`
function getDefaultStatus(): CreateStatusParamsWithStatus {
  return {
    status: '',
    inReplyToId,
  }
}
const draft = useLocalStorage<CreateStatusParamsWithStatus>(storageKey, getDefaultStatus())

async function publish() {
  try {
    isSending = true
    await masto.statuses.create(draft.value)
    draft.value = getDefaultStatus()
  }
  finally {
    isSending = false
  }
}

onUnmounted(() => {
  if (!draft.value.status) {
    draft.value = undefined
    nextTick(() => {
      localStorage.removeItem(storageKey)
    })
  }
})
</script>

<template>
  <div
    flex flex-col gap-4
    :class="isSending ? 'pointer-events-none' : ''"
  >
    <textarea
      v-model="draft.status"
      :placeholder="placeholder"
      p2 border-rounded w-full h-40
      bg-gray:10 outline-none border="~ border"
    />
    <div flex justify-end>
      <button
        h-9 w-22 bg-primary border-rounded
        :disabled="draft.status === ''"
        @click="publish"
      >
        Publish!
      </button>
    </div>
  </div>
</template>
