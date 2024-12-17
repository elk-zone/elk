import type { Editor } from '@tiptap/vue-3'
import type { Ref } from 'vue'
import Bold from '@tiptap/extension-bold'
import Code from '@tiptap/extension-code'
import Document from '@tiptap/extension-document'
import HardBreak from '@tiptap/extension-hard-break'
import History from '@tiptap/extension-history'
import Italic from '@tiptap/extension-italic'
import Mention from '@tiptap/extension-mention'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import { Extension, useEditor } from '@tiptap/vue-3'

import { Plugin } from 'prosemirror-state'
import { TiptapPluginCustomEmoji } from './tiptap/custom-emoji'
import { TiptapPluginEmoji } from './tiptap/emoji'
import { TiptapPluginCodeBlockShiki } from './tiptap/shiki'
import { TiptapEmojiSuggestion, TiptapHashtagSuggestion, TiptapMentionSuggestion } from './tiptap/suggestion'

export interface UseTiptapOptions {
  content: Ref<string>
  placeholder: Ref<string | undefined>
  onSubmit: () => void
  onFocus: () => void
  onPaste: (event: ClipboardEvent) => void
  autofocus: boolean
}

export function useTiptap(options: UseTiptapOptions) {
  if (import.meta.server)
    return { editor: ref<Editor | undefined>() }

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
      TiptapPluginEmoji,
      TiptapPluginCustomEmoji.configure({
        inline: true,
        HTMLAttributes: {
          class: 'custom-emoji',
        },
      }),
      Mention.configure({
        renderHTML({ options, node }) {
          return ['span', { 'data-type': 'mention', 'data-id': node.attrs.id }, `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`]
        },
        suggestion: TiptapMentionSuggestion,
      }),
      Mention
        .extend({ name: 'hashtag' })
        .configure({
          renderHTML({ options, node }) {
            return ['span', { 'data-type': 'hashtag', 'data-id': node.attrs.id }, `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`]
          },
          suggestion: TiptapHashtagSuggestion,
        }),
      Mention
        .extend({ name: 'emoji' })
        .configure({
          suggestion: TiptapEmojiSuggestion,
        }),
      Placeholder.configure({
        placeholder: () => placeholder.value!,
      }),
      TiptapPluginCodeBlockShiki,
      History.configure({
        depth: 10,
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
    parseOptions: {
      preserveWhitespace: 'full',
    },
    autofocus,
    editable: true,
  })

  watch(content, (value) => {
    if (editor.value?.getHTML() === value)
      return
    editor.value?.commands.setContent(value || '', false)
  })
  watch(placeholder, () => {
    editor.value?.view.dispatch(editor.value?.state.tr)
  })

  return {
    editor,
  }
}
