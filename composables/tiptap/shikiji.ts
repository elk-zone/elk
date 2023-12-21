import CodeBlock from '@tiptap/extension-code-block'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import { createHighlightPlugin } from 'prosemirror-highlight'
import { shikijiParser } from './shikiji-parser'
import TiptapCodeBlock from '~/components/tiptap/TiptapCodeBlock.vue'

export const TiptapPluginCodeBlockShikiji = CodeBlock.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      defaultLanguage: null,
    }
  },

  addProseMirrorPlugins() {
    return [
      createHighlightPlugin({ parser: shikijiParser, nodeTypes: ['codeBlock'] }),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(TiptapCodeBlock)
  },
})
