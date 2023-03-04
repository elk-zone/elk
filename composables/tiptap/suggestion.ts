import type { GetReferenceClientRect, Instance } from 'tippy.js'
import tippy from 'tippy.js'
import { VueRenderer } from '@tiptap/vue-3'
import type { SuggestionOptions } from '@tiptap/suggestion'
import { PluginKey } from 'prosemirror-state'
import type { Component } from 'vue'
import type { Emoji, EmojiMartData } from '@emoji-mart/data'
import type { mastodon } from 'masto'
import { currentCustomEmojis, updateCustomEmojis } from '~/composables/emojis'
import TiptapMentionList from '~/components/tiptap/TiptapMentionList.vue'
import TiptapHashtagList from '~/components/tiptap/TiptapHashtagList.vue'
import TiptapEmojiList from '~/components/tiptap/TiptapEmojiList.vue'

export { Emoji }

export type CustomEmoji = (mastodon.v1.CustomEmoji & { custom: true })
export const isCustomEmoji = (emoji: CustomEmoji | Emoji): emoji is CustomEmoji => !!(emoji as CustomEmoji).custom

export const TiptapMentionSuggestion: Partial<SuggestionOptions> = process.server
  ? {}
  : {
      pluginKey: new PluginKey('mention'),
      char: '@',
      async items({ query }) {
        if (query.length === 0)
          return []

        const results = await useMastoClient().v2.search({ q: query, type: 'accounts', limit: 25, resolve: true })
        return results.accounts
      },
      render: createSuggestionRenderer(TiptapMentionList),
    }

export const TiptapHashtagSuggestion: Partial<SuggestionOptions> = {
  pluginKey: new PluginKey('hashtag'),
  char: '#',
  async items({ query }) {
    if (query.length === 0)
      return []

    const results = await useMastoClient().v2.search({
      q: query,
      type: 'hashtags',
      limit: 25,
      resolve: false,
      excludeUnreviewed: true,
    })
    return results.hashtags
  },
  render: createSuggestionRenderer(TiptapHashtagList),
}

export const TiptapEmojiSuggestion: Partial<SuggestionOptions> = {
  pluginKey: new PluginKey('emoji'),
  char: ':',
  async items({ query }): Promise<(CustomEmoji | Emoji)[]> {
    if (process.server || query.length === 0)
      return []

    if (currentCustomEmojis.value.emojis.length === 0)
      await updateCustomEmojis()

    const emojis = await import('@emoji-mart/data')
      .then(r => r.default as EmojiMartData)
      .then(data => Object.values(data.emojis).filter(({ id }) => id.startsWith(query)))

    const customEmojis: CustomEmoji[] = currentCustomEmojis.value.emojis
      .filter(emoji => emoji.shortcode.startsWith(query))
      .map(emoji => ({ ...emoji, custom: true }))
    return [...emojis, ...customEmojis]
  },
  command: ({ editor, props, range }) => {
    const emoji: CustomEmoji | Emoji = props.emoji
    editor.commands.deleteRange(range)
    if (isCustomEmoji(emoji)) {
      editor.commands.insertCustomEmoji({
        title: emoji.shortcode,
        src: emoji.url,
      })
    }
    else {
      const skin = emoji.skins.find(skin => skin.native !== undefined)
      if (skin)
        editor.commands.insertEmoji(skin.native)
    }
  },
  render: createSuggestionRenderer(TiptapEmojiList),
}

function createSuggestionRenderer(component: Component): SuggestionOptions['render'] {
  return () => {
    let renderer: VueRenderer
    let popup: Instance

    return {
      onStart(props) {
        renderer = new VueRenderer(component, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect)
          return

        popup = tippy(document.body, {
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
          appendTo: () => document.body,
          content: renderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      // Use arrow function here because Nuxt will transform it incorrectly as Vue hook causing the build to fail
      onBeforeUpdate: (props) => {
        props.editor.isFocused && renderer.updateProps({ ...props, isPending: true })
      },

      onUpdate(props) {
        if (!props.editor.isFocused)
          return

        renderer.updateProps({ ...props, isPending: false })

        if (!props.clientRect)
          return

        popup?.setProps({
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup?.hide()
          return true
        }
        return renderer?.ref?.onKeyDown(props.event)
      },

      onExit() {
        popup?.destroy()
        renderer?.destroy()
      },
    }
  }
}
