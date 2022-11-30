import { Extension, VueNodeViewRenderer, useEditor } from '@tiptap/vue-3'
import Placeholder from '@tiptap/extension-placeholder'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Mention from '@tiptap/extension-mention'
import CharacterCount from '@tiptap/extension-character-count'
import HardBreak from '@tiptap/extension-hard-break'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Code from '@tiptap/extension-code'
import { Plugin } from 'prosemirror-state'
import CodeBlock from '@tiptap/extension-code-block'

import type { Ref } from 'vue'
import { HashSuggestion, MentionSuggestion } from './tiptap/suggestion'
import TiptapCodeBlock from '~/components/tiptap/TiptapCodeBlock.vue'

export interface UseTiptapOptions {
  content: Ref<string | undefined>
  placeholder: Ref<string | undefined>
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
      HardBreak,
      Bold,
      Italic,
      Code,
      Text,
      Mention.configure({
        suggestion: MentionSuggestion,
      }),
      Mention
        .extend({ name: 'hastag' })
        .configure({
          suggestion: HashSuggestion,
        }),
      Placeholder.configure({
        placeholder: placeholder.value,
      }),
      CharacterCount.configure({
        limit: characterLimit.value,
      }),
      CodeBlock
        .extend({
          addNodeView() {
            return VueNodeViewRenderer(TiptapCodeBlock)
          },
        }),
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
