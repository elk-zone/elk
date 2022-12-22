<script setup>
const disabled = computed(() => !isMastoInitialised.value || !currentUser.value)
const disabledVisual = computed(() => isMastoInitialised.value && !currentUser.value)
</script>

<template>
  <button
    color-primary rounded-full ml-7 lg:ml-3 w-9 lg:w-auto font-bold py2 lg:py4 flex="~ gap2 center"
    cursor-pointer disabled:pointer-events-none
    text-primary border-1 border-primary
    :disabled="disabled" :class="disabledVisual ? 'op25' : 'hover:bg-primary hover:text-inverted'"
    @click="openPublishDialog()"
  >
    <div i-ri:quill-pen-line />
    <span hidden lg:block>{{ $t('action.compose') }}</span>
  </button>
</template>
