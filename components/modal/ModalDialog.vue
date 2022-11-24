<script setup lang='ts'>
import { closeDialog } from '~/composables/dialog'
const dialog = $ref<null | HTMLDialogElement>(null)
onMounted(() => {
  dialog?.showModal()

  dialog?.addEventListener('close', () => {
    closeDialog()
  })
})
</script>

<template>
  <dialog ref="dialog">
    <slot />
  </dialog>
</template>
