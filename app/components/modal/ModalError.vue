<script setup lang="ts">
import type { ErrorDialogData } from '#shared/types'

defineProps<ErrorDialogData>()
</script>

<template>
  <div flex="~ col" gap-6>
    <div font-bold text-lg text-center>
      {{ title }}
    </div>
    <div
      flex="~ col"
      gap-1 text-sm
      pt-1 ps-2 pe-1 pb-2
      text-red-600 dark:text-red-400
      border="~ base rounded red-600 dark:red-400"
    >
      <ol ps-2 sm:ps-1>
        <li v-for="(message, i) in messages" :key="i" flex="~ col sm:row" gap-y-1 sm:gap-x-2>
          {{ message }}
        </li>
      </ol>
    </div>
    <div flex justify-end gap-2>
      <button btn-text @click="closeErrorDialog()">
        {{ close }}
      </button>
    </div>
  </div>
</template>
