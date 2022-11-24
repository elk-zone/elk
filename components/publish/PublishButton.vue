<script setup lang="ts">
function openDialog() {
  if (dialogDraft.draft.value.editingStatus)
    openPublishDialog(getDefaultDraft())
  else openPublishDialog()
}
</script>

<template>
  <button btn-outline rounded-full font-bold py4 flex="~ gap2 center" @click="openDialog">
    <div i-ri:quill-pen-line />
    Compose
  </button>
</template>
