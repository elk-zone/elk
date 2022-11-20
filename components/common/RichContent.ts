export default defineComponent({
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => contentToVNode(props.content)
  },
})
