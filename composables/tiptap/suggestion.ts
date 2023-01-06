import type { GetReferenceClientRect, Instance } from 'tippy.js'
import tippy from 'tippy.js'
import { VueRenderer } from '@tiptap/vue-3'
import type { SuggestionOptions } from '@tiptap/suggestion'
import { PluginKey } from 'prosemirror-state'
import type { Component } from 'vue'
import TiptapMentionList from '~/components/tiptap/TiptapMentionList.vue'
import TiptapHashtagList from '~/components/tiptap/TiptapHashtagList.vue'

export const MentionSuggestion: Partial<SuggestionOptions> = {
  pluginKey: new PluginKey('mention'),
  char: '@',
  async items({ query }) {
    if (query.length === 0)
      return []

    const mentionPaginator = useMasto().search({ q: query, type: 'accounts', limit: 25, resolve: true })
    const results = await mentionPaginator.next()

    return results.value.accounts
  },
  render: createSuggestionRenderer(TiptapMentionList),
}

export const HashtagSuggestion: Partial<SuggestionOptions> = {
  pluginKey: new PluginKey('hashtag'),
  char: '#',
  async items({ query }) {
    if (query.length === 0)
      return []

    const paginator = useMasto().search({ q: query, type: 'hashtags', limit: 25, resolve: true })
    const results = await paginator.next()

    return results.value.hashtags
  },
  render: createSuggestionRenderer(TiptapHashtagList),
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
        renderer.updateProps({ ...props, isPending: true })
      },

      onUpdate(props) {
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
