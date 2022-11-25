import { useEditor } from '@tiptap/vue-3'
import Placeholder from '@tiptap/extension-placeholder'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Mention from '@tiptap/extension-mention'
import type { Ref } from 'vue'

import CharacterCount from '@tiptap/extension-character-count'
import { HashSuggestion, MentionSuggestion } from './tiptap/suggestion'
import { POST_CHARS_LIMIT } from '~/constants'

export function useTiptap(content: Ref<string | undefined>, placeholder?: string) {
  const editor = useEditor({
    content: content.value,
    extensions: [
      Document,
      Paragraph.configure({
        HTMLAttributes: {
          class: 'my-custom-paragraph',
        },
      }),
      Text.configure({
      }),
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
        limit: POST_CHARS_LIMIT,
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
    autofocus: true,
    editable: true,
  })

  return {
    editor,
  }
}
