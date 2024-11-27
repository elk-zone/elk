import type { ExtendedRegExpMatchArray, InputRuleFinder, nodeInputRule } from '@tiptap/core'
import type { NodeType } from '@tiptap/pm/model'
import {
  callOrReturn,
  InputRule,
  mergeAttributes,
  Node,
  nodePasteRule,
} from '@tiptap/core'
import { emojiRegEx, getEmojiAttributes } from '~/config/emojis'

function wrapHandler<T extends (...args: any[]) => any>(handler: T): T {
  return <T>((...args: any[]) => {
    try {
      return handler(...args)
    }
    catch {
      return null
    }
  })
}

function createEmojiRule<NR extends typeof nodeInputRule | typeof nodePasteRule>(
  nodeRule: NR,
  type: Parameters<NR>[0]['type'],
): ReturnType<NR>[] {
  const rule = nodeRule({
    find: emojiRegEx as RegExp,
    type,
    getAttributes: (match: ExtendedRegExpMatchArray) => {
      const [native] = match
      return getEmojiAttributes(native)
    },
  }) as ReturnType<NR>

  // Error catch for unsupported emoji
  rule.handler = wrapHandler(rule.handler.bind(rule))

  return [rule]
}

export const TiptapPluginEmoji = Node.create({
  name: 'em-emoji',

  inline: () => true,
  group: () => 'inline',
  draggable: false,

  parseHTML() {
    return [
      {
        tag: 'img.iconify-emoji',
      },
    ]
  },

  addAttributes() {
    return {
      alt: {
        default: null,
      },
      src: {
        default: null,
      },
      class: {
        default: null,
      },
    }
  },

  renderHTML(args) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, args.HTMLAttributes)]
  },

  addCommands() {
    return {
      insertEmoji: code => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: getEmojiAttributes(code),
        })
      },
    }
  },

  addInputRules() {
    function emojiInputRule(config: {
      find: InputRuleFinder
      type: NodeType
      getAttributes?:
        | Record<string, any>
        | ((match: ExtendedRegExpMatchArray) => Record<string, any>)
        | false
        | null
    }) {
      return new InputRule({
        find: config.find,
        handler: ({ state, range, match }) => {
          const attributes = callOrReturn(config.getAttributes, undefined, match) || {}
          const { tr } = state
          const start = range.from
          const end = range.to

          tr.insert(start, config.type.create(attributes)).delete(
            tr.mapping.map(start),
            tr.mapping.map(end),
          )

          tr.scrollIntoView()
        },
      })
    }

    return createEmojiRule(emojiInputRule, this.type)
  },

  addPasteRules() {
    return createEmojiRule(nodePasteRule, this.type)
  },
})
