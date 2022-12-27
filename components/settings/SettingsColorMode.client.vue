<script setup lang="ts">
function setDark(v: boolean) {
  isDark.value = v
}
</script>

<template>
  <div flex="~ gap4" w-full>
    <button
      btn-text flex-1 flex="~ gap-1 center" p4 border="~ base rounded" bg-base
      :class="isDark ? 'pointer-events-none' : 'filter-saturate-0'"
      @click="setDark(true)"
    >
      <div i-ri:moon-line />
      Dark Mode
    </button>
    <button
      btn-text flex-1 flex="~ gap-1 center" p4 border="~ base rounded" bg-base
      :class="!isDark ? 'pointer-events-none' : 'filter-saturate-0'"
      @click="setDark(false)"
    >
      <div i-ri:sun-line />
      Light Mode
    </button>
  </div>
</template>
