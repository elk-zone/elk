<script setup lang="ts">
const props = defineProps<{ editedAt: string }>()

const editedAt = useFormattedDateTime(props.editedAt)
</script>

<template>
  <CommonTooltip :content="`Edited ${editedAt}`">
    <time :title="props.editedAt" :datetime="props.editedAt" underline decoration-dashed>&nbsp;*</time>
  </CommonTooltip>
</template>
