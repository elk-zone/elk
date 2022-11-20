<script setup lang="ts">
const masto = await useMasto()

let draftPost = $ref('')
let isSending = $ref(false)

async function publish() {
  try {
    isSending = true
    await masto.statuses.create({ status: draftPost })
    draftPost = ''
  }
  finally {
    isSending = false
  }
}
</script>

<template>
  <div flex flex-col gap-4 :class="isSending ? ' pointer-events-none' : ''">
    <textarea
      v-model="draftPost"
      placeholder="What's on your mind?"
      p2 border-rounded w-full h-40
      bg-gray:10 outline-none border="~ border"
    />
    <div flex justify-end>
      <button h-9 w-22 bg-primary border-rounded :disabled="draftPost === ''" @click="publish">
        Publish!
      </button>
    </div>
  </div>
</template>
