<script setup lang="ts">
const emit = defineEmits<{
  (event: 'onRemove'): void
  (event: 'onUpdate'): void
}>()
let isEditing = $ref<boolean>(false)
let keyword = $ref<string>('')
const edit = ref()
const input = ref()

const { modelValue } = defineModel<{
  modelValue: string
}>()

keyword = modelValue.value

function prepareEdit() {
  isEditing = true

  nextTick(() => {
    input.value?.focus()
  })
}

function saveEdit() {
  isEditing = false
  modelValue.value = keyword
  emit('onUpdate')

  nextTick(() => {
    edit.value?.focus()
  })
}

function cancelEdit() {
  isEditing = false
  keyword = modelValue.value

  nextTick(() => {
    edit.value?.focus()
  })
}

function deleteKeyword() {
  emit('onRemove')
}

const enableSaveButton = computed(() => keyword !== modelValue.value)

onDeactivated(cancelEdit)
</script>

<template>
  <div hover:bg-active flex justify-between items-center gap-x-2>
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
        v-model="keyword"
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
    <div v-else block grow p4>
      {{ keyword }}
    </div>
    <div mr4 flex gap2>
      <CommonTooltip v-if="isEditing" :content="$t('list.save')" no-auto-focus>
        <button
          type="submit"
          text-sm p2 border-1 transition-colors
          border-dark hover:text-primary
          btn-action-icon
          :disabled="!enableSaveButton"
          @click.prevent="saveEdit"
        >
          <template v-if="isEditing">
            <span block text-current i-ri:save-2-fill class="rtl-flip" />
          </template>
        </button>
      </CommonTooltip>
      <CommonTooltip v-else :content="$t('settings.preferences.filters.editing.edit_keyword')" no-auto-focus>
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
      <CommonTooltip :content="$t('settings.preferences.filters.editing.delete_keyword')" no-auto-focus>
        <button
          ref="delete"
          type="button"
          text-sm p2 border-1 transition-colors
          border-dark hover:text-primary
          btn-action-icon
          :disabled="isEditing"
          @click.prevent="deleteKeyword"
        >
          <span block text-current i-ri:delete-bin-2-line class="rtl-flip" />
        </button>
      </CommonTooltip>
    </div>
  </div>
</template>
