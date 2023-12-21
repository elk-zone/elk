<script setup lang="ts">
import type { Editor } from '@tiptap/core'

const { editor } = defineProps<{
  editor: Editor
}>()
</script>

<template>
  <CommonTooltip placement="top" :content="$t('tooltip.open_editor_tools')">
    <VDropdown v-if="editor" placement="top">
      <button
        btn-action-icon
        :aria-label="$t('tooltip.open_editor_tools')"
      >
        <div i-ri:font-size-2 />
      </button>
      <template #popper>
        <div flex gap-1>
          <CommonTooltip placement="top" :content="$t('tooltip.toggle_code_block')">
            <button
              btn-action-icon
              :aria-label="$t('tooltip.toggle_code_block')"
              :class="editor.isActive('codeBlock') ? 'text-primary' : ''"
              @click="editor?.chain().focus().toggleCodeBlock().run()"
            >
              <div i-ri:code-s-slash-line />
            </button>
          </CommonTooltip>
          <CommonTooltip placement="top" :content="$t('tooltip.toggle_bold')">
            <button
              btn-action-icon
              :aria-label="$t('tooltip.toggle_bold')"
              :class="editor.isActive('bold') ? 'text-primary' : ''"
              @click="editor?.chain().focus().toggleBold().run()"
            >
              <div i-ri:bold />
            </button>
          </CommonTooltip>
          <CommonTooltip placement="top" :content="$t('tooltip.toggle_italic')">
            <button
              btn-action-icon
              :aria-label="$t('tooltip.toggle_italic')"
              :class="editor.isActive('italic') ? 'text-primary' : ''"
              @click="editor?.chain().focus().toggleItalic().run()"
            >
              <div i-ri:italic />
            </button>
          </CommonTooltip>
        </div>
      </template>
    </VDropdown>
  </CommonTooltip>
</template>
