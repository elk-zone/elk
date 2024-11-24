import {
  mergeAttributes,
  Node,
  nodeInputRule,
} from '@tiptap/core'

export interface EmojiOptions {
  inline: boolean
  allowBase64: boolean
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    emoji: {
      /**
       * Insert a custom emoji.
       */
      insertCustomEmoji: (options: {
        src: string
        alt?: string
        title?: string
      }) => ReturnType
      /**
       * Insert a emoji.
       */
      insertEmoji: (native: string) => ReturnType
    }
  }
}

const inputRegex = /(?:^|\s)(!\[(.+|:?)\]\((\S+)(?:\s+["'](\S+)["'])?\))$/

export const TiptapPluginCustomEmoji = Node.create<EmojiOptions>({
  name: 'custom-emoji',

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    }
  },

  inline() {
    return this.options.inline
  },

  group() {
    return this.options.inline ? 'inline' : 'block'
  },

  draggable: false,

  addAttributes() {
    return {
      'src': {
        default: null,
      },
      'alt': {
        default: null,
      },
      'title': {
        default: null,
      },
      'width': {
        default: null,
      },
      'height': {
        default: null,
      },
      'data-emoji-id': {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64
          ? 'img[src]'
          : 'img[src]:not([src^="data:"])',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addCommands() {
    return {
      insertCustomEmoji: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [,, alt, src, title] = match

          return { src, alt, title }
        },
      }),
    ]
  },
})
