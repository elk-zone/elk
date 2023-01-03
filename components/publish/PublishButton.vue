<script setup>
const disabled = computed(() => !isMastoInitialised.value || !currentUser.value)
const disabledVisual = computed(() => isMastoInitialised.value && !currentUser.value)
</script>

<template>
  <button
    flex="~ gap2 center"
    w-9 h-9 py2
    xl="w-auto h-auto py-4"
    rounded-full
    cursor-pointer disabled:pointer-events-none
    text-primary font-bold
    border-1 border-primary
    :class="disabledVisual ? 'op25' : 'hover:bg-primary hover:text-inverted'"
    :disabled="disabled"
    @click="openPublishDialog()"
  >
    <div i-ri:quill-pen-line />
    <span hidden xl:block>{{ $t('action.compose') }}</span>
  </button>
</template>
