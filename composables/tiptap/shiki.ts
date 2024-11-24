import CodeBlock from '@tiptap/extension-code-block'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import { createHighlightPlugin } from 'prosemirror-highlight'
import TiptapCodeBlock from '~/components/tiptap/TiptapCodeBlock.vue'
import { shikiParser } from './shiki-parser'

export const TiptapPluginCodeBlockShiki = CodeBlock.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      defaultLanguage: null,
    }
  },

  addProseMirrorPlugins() {
    return [
      createHighlightPlugin({ parser: shikiParser, nodeTypes: ['codeBlock'] }),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(TiptapCodeBlock)
  },
})
