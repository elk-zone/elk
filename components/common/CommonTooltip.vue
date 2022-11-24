<script setup lang="ts">

</script>

<template>
  <VTooltip
    v-bind="$attrs"
  >
    <slot />
    <template #popper>
      <div text-3>
        <slot name="popper" />
      </div>
    </template>
  </VTooltip>
</template>
