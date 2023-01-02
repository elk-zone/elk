import {
  Node,
  mergeAttributes,
  nodeInputRule,
} from '@tiptap/core'
import { emojiRegEx, getEmojiAttributes } from '~/config/emojis'

export const Emoji = Node.create({
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
    const inputRule = nodeInputRule({
      find: emojiRegEx as RegExp,
      type: this.type,
      getAttributes: (match) => {
        const [native] = match
        return getEmojiAttributes(native)
      },
    })
    // Error catch for unsupported emoji
    const handler = inputRule.handler.bind(inputRule)
    inputRule.handler = (...args) => {
      try {
        return handler(...args)
      }
      catch (e) {
        return null
      }
    }
    return [
      inputRule,
    ]
  },
})
