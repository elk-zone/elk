<script setup lang="ts">
import type { mastodon } from 'masto'

const emit = defineEmits<{
  (e: 'listUpdated', list: mastodon.v1.List): void
  (e: 'listRemoved', id: string): void
}>()
const { list } = $defineProps<{
  list: mastodon.v1.List
}>()
const { modelValue } = defineModel<{
  modelValue: string
}>()
modelValue.value = list.title

const { t } = useI18n()
const client = useMastoClient()

let isEditing = $ref<boolean>(false)
let busy = $ref<boolean>(false)
let deleteBusy = $ref<boolean>(false)

const enableSaveButton = computed(() => list.title !== modelValue.value)

const edit = ref()
const input = ref()

const prepareEdit = () => {
  isEditing = true
  nextTick(() => {
    input.value.focus()
  })
}
const cancelEdit = (updateTitle = true) => {
  isEditing = false
  if (updateTitle)
    modelValue.value = list.title
  nextTick(() => {
    edit.value.focus()
  })
}
async function finishEditing() {
  if (busy || !isEditing || !enableSaveButton.value)
    return

  busy = true
  await nextTick()
  try {
    const updateList = await client.v1.lists.update(list.id, {
      title: modelValue.value,
    })
    cancelEdit(false)
    emit('listUpdated', updateList)
  }
  finally {
    busy = false
  }
}
async function removeList() {
  if (deleteBusy)
    return

  deleteBusy = true
  await nextTick()

  const confirmDelete = await openConfirmDialog({
    title: t('confirm.delete_list.title'),
    confirm: t('confirm.delete_list.confirm'),
    cancel: t('confirm.delete_list.cancel'),
  })

  if (confirmDelete === 'confirm') {
    await nextTick()
    try {
      await client.v1.lists.remove(list.id)
      emit('listRemoved', list.id)
    }
    finally {
      deleteBusy = false
    }
  }
  else {
    deleteBusy = false
  }
}
onBeforeUnmount(() => cancelEdit(false))
</script>

<template>
  <form hover:bg-active flex justify-between items-center @submit.prevent="finishEditing">
    <div
      v-if="isEditing"
      bg-base border="~ base" h10 m2 ps-1 pe-4 rounded-3 w-full flex="~ row"
      items-center relative focus-within:box-shadow-outline gap-3
    >
      <CommonTooltip v-if="isEditing" :content="$t('list.cancel_edit')">
        <button
          type="button"
          rounded-full text-sm p2 transition-colors
          hover:text-primary
          @click="cancelEdit(true)"
        >
          <span block text-current i-ri:close-fill />
        </button>
      </CommonTooltip>
      <input
        ref="input"
        v-model="modelValue"
        rounded-3
        w-full
        bg-transparent
        outline="focus:none"
        pe-4
        pb="1px"
        flex-1
        placeholder-text-secondary
      >
    </div>
    <NuxtLink v-else :to="`/list/${list.id}`" block grow p4>
      {{ list.title }}
    </NuxtLink>
    <div mr4 flex gap2>
      <CommonTooltip v-if="isEditing" :content="$t('list.save')">
        <button
          type="submit"
          text-sm p2 border-1 transition-colors
          border-dark hover:text-primary
          btn-action-icon
          :disabled="deleteBusy || !enableSaveButton || busy"
        >
          <template v-if="isEditing">
            <span v-if="busy" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
              <span block i-ri:loader-2-fill aria-hidden="true" />
            </span>
            <span v-else block text-current i-ri:save-2-fill class="rtl-flip" />
          </template>
        </button>
      </CommonTooltip>
      <CommonTooltip v-else :content="$t('list.edit')">
        <button
          ref="edit"
          type="button"
          text-sm p2 border-1 transition-colors
          border-dark hover:text-primary
          btn-action-icon
          @click.prevent="prepareEdit"
        >
          <span block text-current i-ri:edit-2-line class="rtl-flip" />
        </button>
      </CommonTooltip>
      <CommonTooltip :content="$t('list.delete')">
        <button
          type="button"
          text-sm p2 border-1 transition-colors
          border-dark hover:text-primary
          btn-action-icon
          :disabled="isEditing"
          @click.prevent="removeList"
        >
          <span v-if="deleteBusy" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
            <span block i-ri:loader-2-fill aria-hidden="true" />
          </span>
          <span v-else block text-current i-ri:delete-bin-2-line class="rtl-flip" />
        </button>
      </CommonTooltip>
    </div>
  </form>
</template>
