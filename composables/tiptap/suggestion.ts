import type { GetReferenceClientRect, Instance } from 'tippy.js'
import tippy from 'tippy.js'
import { VueRenderer } from '@tiptap/vue-3'
import type { SuggestionOptions } from '@tiptap/suggestion'
import { PluginKey } from 'prosemirror-state'
import TiptapMentionList from '~/components/tiptap/TiptapMentionList.vue'

export const MentionSuggestion: Partial<SuggestionOptions> = {
  pluginKey: new PluginKey('mention'),
  char: '@',
  async items({ query }) {
    if (query.length === 0)
      return []

    const mentionPaginator = masto.search({ q: query, type: 'accounts', limit: 25, resolve: true })
    const results = await mentionPaginator.next()

    return results.value.accounts
  },
  render: createSuggestionRenderer(),
}

export const HashSuggestion: Partial<SuggestionOptions> = {
  pluginKey: new PluginKey('hashtag'),
  char: '#',
  items({ query }) {
    // TODO: query
    return [
      'TODO HASH QUERY',
    ].filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
  },
  render: createSuggestionRenderer(),
}

function createSuggestionRenderer(): SuggestionOptions['render'] {
  return () => {
    let component: VueRenderer
    let popup: Instance

    return {
      onStart: (props) => {
        component = new VueRenderer(TiptapMentionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect)
          return

        popup = tippy(document.body, {
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props) {
        component.updateProps(props)

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
        return component?.ref?.onKeyDown(props.event)
      },

      onExit() {
        popup?.destroy()
        component?.destroy()
      },
    }
  }
}
