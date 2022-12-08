<script setup lang="ts">
const props = defineProps<{ enabled?: boolean; filter?: boolean }>()

const showContent = ref(!props.enabled)
const toggleContent = useToggle(showContent)

watchEffect(() => {
  showContent.value = !props.enabled
})
</script>

<template>
  <div v-if="enabled" flex flex-col items-start>
    <div class="content-rich" px-4 pb-2 text-center text-secondary text-sm w-full border-b="~ base" border-b-dotted border-b-2 mt-2>
      <slot name="spoiler" />
    </div>
    <div flex="~ gap-1 center" w-full mt="-3.5">
      <button btn-text px-2 py-1 text-3 bg-base flex="~ center gap-2" :class="showContent ? '' : 'filter-saturate-0 hover:filter-saturate-100'" @click="toggleContent()">
        <div v-if="showContent" i-ri:eye-line />
        <div v-else i-ri:eye-close-line />
        {{ showContent ? $t('status.spoiler_show_less') : $t(filter ? 'status.filter_show_anyway' : 'status.spoiler_show_more') }}
      </button>
    </div>
  </div>
  <slot v-if="!enabled || showContent" />
</template>
