import { Extension, useEditor } from '@tiptap/vue-3'
import Placeholder from '@tiptap/extension-placeholder'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Mention from '@tiptap/extension-mention'
import CodeBlock from '@tiptap/extension-code-block'
import CharacterCount from '@tiptap/extension-character-count'
import { Plugin } from 'prosemirror-state'

import type { Ref } from 'vue'
import { HashSuggestion, MentionSuggestion } from './tiptap/suggestion'

export interface UseTiptapOptions {
  content: Ref<string | undefined>
  placeholder: string
  onSubmit: () => void
  onFocus: () => void
  onPaste: (event: ClipboardEvent) => void
  autofocus: boolean
}

export function useTiptap(options: UseTiptapOptions) {
  const {
    autofocus,
    content,
    placeholder,
  } = options

  const editor = useEditor({
    content: content.value,
    extensions: [
      Document,
      Paragraph,
      Text,
      Mention.configure({
        suggestion: MentionSuggestion,
      }),
      Mention.configure({
        suggestion: HashSuggestion,
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: characterLimit.value,
      }),
      CodeBlock,
      Extension.create({
        name: 'api',
        addKeyboardShortcuts() {
          return {
            'Mod-Enter': () => {
              options.onSubmit()
              return true
            },
          }
        },
        onFocus() {
          options.onFocus()
        },
        addProseMirrorPlugins() {
          return [
            new Plugin({
              props: {
                handleDOMEvents: {
                  paste(view, event) {
                    options.onPaste(event)
                  },
                },
              },
            }),
          ]
        },
      }),
    ],
    onUpdate({ editor }) {
      content.value = editor.getHTML()
    },
    editorProps: {
      attributes: {
        class: 'content-editor content-rich',
      },
    },
    autofocus,
    editable: true,
  })

  watch(content, (value) => {
    if (editor.value?.getHTML() === value)
      return
    editor.value?.commands.setContent(value || '', false)
  })

  return {
    editor,
  }
}
