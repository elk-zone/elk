<script setup lang="ts">
const props = defineProps<{ enabled: boolean }>()

const showContent = ref(!props.enabled)
const toggleContent = useToggle(showContent)

watchEffect(() => {
  showContent.value = !props.enabled
})
</script>

<template>
  <div v-if="enabled" flex flex-col items-start>
    <div class="content-rich">
      <slot name="spoiler" />
    </div>
    <div flex="~ gap-1 center" w-full>
      <div border="t base" w-5 h-1px />
      <button btn-text px-2 py-1 text-3 flex="~ center gap-2" :class="showContent ? '' : 'filter-saturate-0 hover:filter-saturate-100'" @click="toggleContent()">
        <div v-if="showContent" i-ri:eye-line />
        <div v-else i-ri:eye-close-line />
        {{ showContent ? $t('status.spoiler_show_less') : $t('status.spoiler_show_more') }}
      </button>
      <div border="t base" flex-auto h-1px />
    </div>
  </div>
  <slot v-if="!enabled || showContent" />
</template>
