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
let actionError = $ref<string | undefined>(undefined)

const enableSaveButton = computed(() => list.title !== modelValue.value)

const edit = ref()
const deleteBtn = ref()
const input = ref()

const prepareEdit = () => {
  isEditing = true
  actionError = undefined
  nextTick(() => {
    input.value?.focus()
  })
}
const cancelEdit = () => {
  isEditing = false
  actionError = undefined
  modelValue.value = list.title

  nextTick(() => {
    edit.value?.focus()
  })
}
async function finishEditing() {
  if (busy || !isEditing || !enableSaveButton.value)
    return

  busy = true
  actionError = undefined
  await nextTick()
  try {
    const updateList = await client.v1.lists.update(list.id, {
      title: modelValue.value,
    })
    cancelEdit()
    emit('listUpdated', updateList)
  }
  catch (err) {
    console.error(err)
    actionError = (err as Error).message
    nextTick(() => {
      input.value?.focus()
    })
  }
  finally {
    busy = false
  }
}
async function removeList() {
  if (deleteBusy)
    return

  deleteBusy = true
  actionError = undefined
  await nextTick()

  const confirmDelete = await openConfirmDialog({
    title: t('confirm.delete_list.title', [list.title]),
    confirm: t('confirm.delete_list.confirm'),
    cancel: t('confirm.delete_list.cancel'),
  })

  if (confirmDelete === 'confirm') {
    await nextTick()
    try {
      await client.v1.lists.remove(list.id)
      emit('listRemoved', list.id)
    }
    catch (err) {
      console.error(err)
      actionError = (err as Error).message
      nextTick(() => {
        deleteBtn.value?.focus()
      })
    }
    finally {
      deleteBusy = false
    }
  }
  else {
    deleteBusy = false
  }
}

function clearError() {
  actionError = undefined
  nextTick(() => {
    if (isEditing)
      input.value?.focus()
    else
      deleteBtn.value?.focus()
  })
}

onDeactivated(cancelEdit)
</script>

<template>
  <form
    hover:bg-active flex justify-between items-center gap-x-2
    :aria-describedby="actionError ? `action-list-error-${list.id}` : undefined"
    :class="actionError ? 'border border-base border-rounded rounded-be-is-0 rounded-be-ie-0 border-b-unset border-$c-danger-active' : null"
    @submit.prevent="finishEditing"
  >
    <div
      v-if="isEditing"
      bg-base border="~ base" h10 m2 ps-1 pe-4 rounded-3 w-full flex="~ row"
      items-center relative focus-within:box-shadow-outline gap-3
    >
      <CommonTooltip v-if="isEditing" :content="$t('list.cancel_edit')" no-auto-focus>
        <button
          type="button"
          rounded-full text-sm p2 transition-colors
          hover:text-primary
          @click="cancelEdit()"
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
        @keydown.esc="cancelEdit()"
      >
    </div>
    <NuxtLink v-else :to="`list/${list.id}`" block grow p4>
      {{ list.title }}
    </NuxtLink>
    <div mr4 flex gap2>
      <CommonTooltip v-if="isEditing" :content="$t('list.save')" no-auto-focus>
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
      <CommonTooltip v-else :content="$t('list.edit')" no-auto-focus>
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
      <CommonTooltip :content="$t('list.delete')" no-auto-focus>
        <button
          ref="delete"
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
  <CommonErrorMessage
    v-if="actionError"
    :id="`action-list-error-${list.id}`"
    :described-by="`action-list-failed-${list.id}`"
    class="rounded-bs-is-0 rounded-bs-ie-0 border-t-dashed m-b-2"
  >
    <header :id="`action-list-failed-${list.id}`" flex justify-between>
      <div flex items-center gap-x-2 font-bold>
        <div aria-hidden="true" i-ri:error-warning-fill />
        <p>{{ $t(`list.${isEditing ? 'edit_error' : 'delete_error'}`) }}</p>
      </div>
      <CommonTooltip placement="bottom" :content="$t('list.clear_error')" no-auto-focus>
        <button
          flex rounded-4 p1 hover:bg-active cursor-pointer transition-100 :aria-label="$t('list.clear_error')"
          @click="clearError"
        >
          <span aria-hidden="true" w="1.75em" h="1.75em" i-ri:close-line />
        </button>
      </CommonTooltip>
    </header>
    <ol ps-2 sm:ps-1>
      <li flex="~ col sm:row" gap-y-1 sm:gap-x-2>
        <strong sr-only>{{ $t('list.error_prefix') }}</strong>
        <span>{{ actionError }}</span>
      </li>
    </ol>
  </CommonErrorMessage>
</template>
