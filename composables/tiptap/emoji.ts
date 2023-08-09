import {
  Node,
  mergeAttributes,
  nodeInputRule,
  nodePasteRule,
} from '@tiptap/core'
import { emojiRegEx, getEmojiAttributes } from '~/config/emojis'

function createEmojiRule<NR extends typeof nodeInputRule | typeof nodePasteRule>(nodeRule: NR,
  type: Parameters<NR>[0]['type']): ReturnType<NR>[] {
  const rule = nodeRule({
    find: emojiRegEx as RegExp,
    type,
    getAttributes: (match) => {
      const [native] = match
      return getEmojiAttributes(native)
    },
  }) as ReturnType<NR>

  // Error catch for unsupported emoji
  const handler = rule.handler.bind(rule)
  rule.handler = (...args) => {
    try {
      return handler(...args)
    }
    catch (e) {
      return null
    }
  }

  return [
    rule,
  ]
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
    return createEmojiRule(nodeInputRule, this.type)
  },

  addPasteRules() {
    return createEmojiRule(nodePasteRule, this.type)
  },
})
