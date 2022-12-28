import {
  Node,
  mergeAttributes,
  nodeInputRule,
} from '@tiptap/core'

export const Emoji = Node.create({
  name: 'em-emoji',

  inline: () => true,
  group: () => 'inline',
  draggable: false,

  parseHTML() {
    return [
      {
        tag: 'em-emoji[native]',
      },
    ]
  },

  addAttributes() {
    return {
      native: {
        default: null,
      },
      fallback: {
        default: null,
      },
    }
  },

  renderHTML(args) {
    return ['em-emoji', mergeAttributes(this.options.HTMLAttributes, args.HTMLAttributes)]
  },

  addCommands() {
    return {
      insertEmoji: name => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            native: name,
            fallback: name,
          },
        })
      },
    }
  },

  addInputRules() {
    const inputRule = nodeInputRule({
      find: EMOJI_REGEX,
      type: this.type,
      getAttributes: (match) => {
        const [native] = match
        return {
          native,
          fallback: native,
        }
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
