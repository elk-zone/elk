<script setup lang="ts">
function openDialog() {
  openPublishDialog()
}
</script>

<template>
  <button btn-outline rounded-full font-bold py4 flex="~ gap2 center" @click="openDialog">
    <div i-ri:quill-pen-line />
    {{ $t('action.compose') }}
  </button>
</template>
