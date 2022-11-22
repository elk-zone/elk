export default defineComponent({
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const serverInfos = useServerInfo(currentServer.value)
    return () => h(
      'div',
      { class: 'rich-content' },
      contentToVNode(props.content, undefined, serverInfos.value?.customEmojis),
    )
  },
})
