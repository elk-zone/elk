import type { CodeBlockOptions } from '@tiptap/extension-code-block'
import CodeBlock from '@tiptap/extension-code-block'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import { findChildren } from '@tiptap/core'
import type { Node as ProsemirrorNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import TiptapCodeBlock from '~/components/tiptap/TiptapCodeBlock.vue'

export interface CodeBlockShikiOptions extends CodeBlockOptions {
  defaultLanguage: string | null | undefined
}

export const TiptapPluginCodeBlockShiki = CodeBlock.extend<CodeBlockShikiOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      defaultLanguage: null,
    }
  },

  addProseMirrorPlugins() {
    return [
      ...this.parent?.() || [],
      ProseMirrorShikiPlugin({
        name: this.name,
      }),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(TiptapCodeBlock)
  },
})

function getDecorations({
  doc,
  name,
}: { doc: ProsemirrorNode; name: string }) {
  const decorations: Decoration[] = []

  findChildren(doc, node => node.type.name === name)
    .forEach((block) => {
      let from = block.pos + 1
      const language = block.node.attrs.language

      const shiki = useHighlighter(language)

      if (!shiki)
        return

      const lines = shiki.codeToThemedTokens(block.node.textContent, language, useShikiTheme())

      lines.forEach((line) => {
        line.forEach((token) => {
          const decoration = Decoration.inline(from, from + token.content.length, {
            style: `color: ${token.color}`,
          })

          decorations.push(decoration)
          from += token.content.length
        })
        from += 1
      })
    })

  return DecorationSet.create(doc, decorations)
}

function ProseMirrorShikiPlugin({ name }: { name: string }) {
  const plugin: Plugin<any> = new Plugin({
    key: new PluginKey('shiki'),

    state: {
      init: (_, { doc }) => getDecorations({
        doc,
        name,
      }),
      apply: (transaction, decorationSet, oldState, newState) => {
        const oldNodeName = oldState.selection.$head.parent.type.name
        const newNodeName = newState.selection.$head.parent.type.name
        const oldNodes = findChildren(oldState.doc, node => node.type.name === name)
        const newNodes = findChildren(newState.doc, node => node.type.name === name)

        if (
          transaction.docChanged
          // Apply decorations if:
          && (
            // selection includes named node,
            [oldNodeName, newNodeName].includes(name)
            // OR transaction adds/removes named node,
            || newNodes.length !== oldNodes.length
            // OR transaction has changes that completely encapsulte a node
            // (for example, a transaction that affects the entire document).
            // Such transactions can happen during collab syncing via y-prosemirror, for example.
            || transaction.steps.some((step) => {
              // @ts-expect-error cast
              return step.from !== undefined
                // @ts-expect-error cast
                && step.to !== undefined
                && oldNodes.some((node) => {
                  // @ts-expect-error cast
                  return node.pos >= step.from
                    // @ts-expect-error cast
                    && node.pos + node.node.nodeSize <= step.to
                })
            })
          )
        ) {
          return getDecorations({
            doc: transaction.doc,
            name,
          })
        }

        return decorationSet.map(transaction.mapping, transaction.doc)
      },
    },

    props: {
      decorations(state) {
        return plugin.getState(state)
      },
    },
  })

  return plugin
}
