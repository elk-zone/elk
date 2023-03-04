<script setup lang="ts">
const props = defineProps<{ enabled?: boolean; filter?: boolean; isDM?: boolean }>()

const showContent = ref(!props.enabled)
const toggleContent = useToggle(showContent)

watchEffect(() => {
  showContent.value = !props.enabled
})
</script>

<template>
  <div v-if="enabled" flex flex-col items-start>
    <div class="content-rich" p="x-4 b-2.5" text-center text-secondary w-full border="~ base" border-0 border-b-dotted border-b-3 mt-2>
      <slot name="spoiler" />
    </div>
    <div flex="~ gap-1 center" w-full :mb="isDM && !showContent ? '4' : ''" mt="-4.5">
      <button btn-text px-2 py-1 :bg="isDM ? 'transparent' : 'base'" flex="~ center gap-2" :class="showContent ? '' : 'filter-saturate-0 hover:filter-saturate-100'" @click="toggleContent()">
        <div v-if="showContent" i-ri:eye-line />
        <div v-else i-ri:eye-close-line />
        {{ showContent ? $t('status.spoiler_show_less') : $t(filter ? 'status.filter_show_anyway' : 'status.spoiler_show_more') }}
      </button>
    </div>
  </div>
  <slot v-if="!enabled || showContent" />
</template>
