<script setup lang="ts">
defineProps<{
  /** For the preview image, only the small image mode is displayed */
  square?: boolean
  /** When it is root card in the list, not appear as a child card */
  root?: boolean
}>()
</script>

<template>
  <div
    of-hidden
    :class="{
      'flex': square,
      'p-4': root,
      'rounded-lg border border-base': !root,
    }"
  >
    <div
      flex flex-col
      display-block of-hidden
      border="base"
      :class="{
        'sm:(min-w-32 w-32 h-32) min-w-22 w-22 h-22 border-r': square,
        'w-full aspect-[1.91] border-b': !square,
        'rounded-lg': root,
      }"
    >
      <div w-full h-full class="skeleton-loading-bg" />
    </div>
    <div
      px3 max-h-2xl
      flex-1 flex flex-col flex-gap-2 sm:flex-gap-3
      :class="[
        root ? 'py2.5 sm:py3' : 'py3  justify-center sm:justify-start',
      ]"
    >
      <div flex class="skeleton-loading-bg" h-4 w-30 rounded :class="root ? '' : 'hidden sm:block'" />
      <div flex class="skeleton-loading-bg" h-5 w="4/5" rounded />
      <div flex="~ col gap-2">
        <div flex class="skeleton-loading-bg" h-4 w-full rounded />
        <div sm:flex hidden class="skeleton-loading-bg" h-4 w="2/5" rounded />
      </div>
    </div>
  </div>
</template>
