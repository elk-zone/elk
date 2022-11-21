import type { Emoji } from 'masto'

export default defineComponent({
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const emojis = shallowRef<Record<string, Emoji>>({})

    onMounted(() => {
      const { server } = useAppCookies()
      const { serverInfos } = useClientState()
      if (server.value)
        emojis.value = serverInfos.value[server.value].customEmojis || {}
    })

    return () => h('div', { class: 'rich-content' }, contentToVNode(props.content, undefined, emojis.value))
  },
})
